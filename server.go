package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func getSearchResults(c *gin.Context) []*Site {
	query := c.Query("q")
	user, err := GetUser(c)
	if err != nil {
		return []*Site{}
	}
	results := []*Site{}
	for _, site := range searchEngine.Search(query) {
		if site.UserID == user.Login || site.Public {
			results = append(results, site)
		}
	}
	return results
}

func redirectHandler(c *gin.Context) {
	query := c.Query("q")
	results := getSearchResults(c)
	if len(results) == 1 {
		c.Redirect(http.StatusTemporaryRedirect, results[0].URL)
		return
	}
	c.Redirect(http.StatusTemporaryRedirect, "/?q="+query)
}

func searchHandler(c *gin.Context) {
	c.JSON(200, getSearchResults(c))
}

type CreateSiteInput struct {
	URL string `json:"URL"`
}

func parseSite(c *gin.Context) {
	var input CreateSiteInput
	if err := c.ShouldBindJSON(&input); err != nil {
		fmt.Println("PARSE")
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	site, err := NewSite(input.URL).Build()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, site)
}

func indexHandler(c *gin.Context) {
	var site Site
	user, _ := GetUser(c)
	if err := c.ShouldBindJSON(&site); err != nil {
		fmt.Println("INDEX")
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	site.UserID = user.Login
	searchEngine.IndexDocument(&site)
	c.Status(200)
}
func UserInfoHandler(c *gin.Context) {
	if user, err := GetUser(c); err == nil {
		c.JSON(200, user)
	}
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

//go:embed frontend/dist/*
var server embed.FS

type embedFileSystem struct {
	http.FileSystem
}

func (e embedFileSystem) Exists(prefix string, path string) bool {
	_, err := e.Open(path)
	if err != nil {
		return false
	}
	return true
}

func EmbedFolder(fsEmbed embed.FS, targetPath string) static.ServeFileSystem {
	fsys, err := fs.Sub(fsEmbed, targetPath)
	if err != nil {
		panic(err)
	}
	return embedFileSystem{
		FileSystem: http.FS(fsys),
	}
}

func startServer(config *Config) {
	r := gin.New()
	store := cookie.NewStore([]byte("secret"))
	r.Use(sessions.Sessions("mysession", store))
	r.Use(GitHubAuth(config))
	r.SetTrustedProxies(nil)
	r.Use(CORSMiddleware())
	r.Use(gin.Logger())
	r.GET("/logout", func(ctx *gin.Context) {
		session := sessions.Default(ctx)
		session.Delete("ginoauthgh")
		session.Delete("state")
	})
	r.GET("/api/user", UserInfoHandler)
	r.GET("/search", redirectHandler)
	r.GET("/api/site", searchHandler)
	r.PUT("/api/site", indexHandler)
	r.POST("/api/site", parseSite)

	r.Use(static.Serve("/", EmbedFolder(server, "frontend/dist")))
	r.NoRoute(func(c *gin.Context) {
		fmt.Println("%s doesn't exists, redirect on /", c.Request.URL.Path)
		c.Redirect(http.StatusMovedPermanently, "/")
	})

	r.Run(":" + config.PORT)
}
