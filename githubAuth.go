package main

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/gob"
	"fmt"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/golang/glog"
	"github.com/google/go-github/github"
	"golang.org/x/oauth2"
	oauth2gh "golang.org/x/oauth2/github"
)

var conf = &oauth2.Config{
	Scopes:   []string{"read:user"},
	Endpoint: oauth2gh.Endpoint,
}

var state string

func randToken() string {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		glog.Fatalf("[Gin-OAuth] Failed to read rand: %v\n", err)
	}
	return base64.StdEncoding.EncodeToString(b)
}
func GetLoginURL(state string) string {
	return conf.AuthCodeURL(state)
}

func LoginRedirect(ctx *gin.Context) string {
	state = randToken()
	session := sessions.Default(ctx)
	session.Set("state", state)
	session.Save()
	url := GetLoginURL(state)
	fmt.Println("URL", url)
	return url
}

type AuthUser struct {
	ID        int64  `json:"id"`
	Login     string `json:"login"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Company   string `json:"company"`
	URL       string `json:"url"`
	AvatarURL string `json:"avatar"`
}

func init() {
	gob.Register(AuthUser{})
}

func GetUser(ctx *gin.Context) (AuthUser, error) {
	if user, ok := ctx.Get("user"); ok {
		return user.(AuthUser), nil
	}
	return AuthUser{}, nil
}

func GitHubAuth(config *Config) gin.HandlerFunc {

	conf.ClientID = config.AUTH_GH_CLIENTID
	conf.ClientSecret = config.AUTH_GH_SECRET
	config.AUTH_CALLBACK = config.AUTH_CALLBACK

	return func(ctx *gin.Context) {
		var (
			ok       bool
			authUser AuthUser
			user     *github.User
		)
		url := ctx.Request.URL.Path
		session := sessions.Default(ctx)
		mysession := session.Get("ginoauthgh")
		if authUser, ok = mysession.(AuthUser); ok {
			ctx.Set("user", authUser)
			ctx.Next()
			return
		}
		if url == "/auth/" {
			tok, err := conf.Exchange(oauth2.NoContext, ctx.Query("code"))
			if err != nil {
				ctx.AbortWithError(http.StatusBadRequest, fmt.Errorf("Failed to do exchange: %v", err))
				return
			}
			client := github.NewClient(conf.Client(oauth2.NoContext, tok))
			user, _, err = client.Users.Get(oauth2.NoContext, "")
			if err != nil {
				ctx.AbortWithError(http.StatusBadRequest, fmt.Errorf("Failed to get user: %v", err))
				return
			}

			// save userinfo, which could be used in Handlers
			authUser = AuthUser{
				ID:        *user.ID,
				Login:     *user.Login,
				Name:      *user.Name,
				URL:       *user.URL,
				AvatarURL: *user.AvatarURL,
			}
			ctx.Set("user", authUser)

			// populate cookie
			session.Set("ginoauthgh", authUser)
			if err := session.Save(); err != nil {
				glog.Errorf("Failed to save session: %v", err)
			}
			session.Set("state", nil)
			ctx.Next()
		}
		//if session.Get("state") == nil {
		ctx.Redirect(http.StatusTemporaryRedirect, LoginRedirect(ctx))
		return
		//}

		//fmt.Println(session.Get())

		ctx.AbortWithError(http.StatusBadRequest, fmt.Errorf("Failed to get user"))
	}
}
