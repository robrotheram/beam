package main

import (
	"log"

	"github.com/spf13/viper"
)

// mentioned in bleve google group
// https://groups.google.com/forum/#!topic/bleve/-5Q6W3oBizY

var searchEngine *SearchEngine

type Config struct {
	DBPATH           string `mapstructure:"DB_SOURCE"`
	PORT             string `mapstructure:"SERVER_PORT"`
	AUTH_GH_CLIENTID string `mapstructure:"AUTH_GH_CLIENTID"`
	AUTH_GH_SECRET   string `mapstructure:"AUTH_GH_SECRET"`
	AUTH_CALLBACK    string `mapstructure:"AUTH_CALLBACK"`
}

func main() {
	config, err := LoadConfig(".")
	if err != nil {
		log.Fatal("cannot load config:", err)
	}

	searchEngine = NewSearchEngine(&config)
	startServer(&config)
}

func LoadConfig(path string) (config Config, err error) {
	viper.AddConfigPath(path)
	viper.SetConfigName("app")
	viper.SetConfigType("env")

	viper.AutomaticEnv()

	err = viper.ReadInConfig()
	if err != nil {
		return
	}

	err = viper.Unmarshal(&config)
	return
}
