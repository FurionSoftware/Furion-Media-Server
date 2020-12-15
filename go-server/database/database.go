package database

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"os"
	"path/filepath"
)

var dbConnection *gorm.DB
var ApiKey = ""
func InitDatabase() {
	db, err := gorm.Open(sqlite.Open("Furion Media Server.db"), &gorm.Config{
		SkipDefaultTransaction: true,
	})
	if err != nil {
		panic("Failed to connect to database")
	}

	db.AutoMigrate(&UserSettings{}, &MediaItem{}, &Library{})
	userSettings := UserSettings{}
	result := db.First(&userSettings)
	if result.Error != nil {
		db.Create(&UserSettings{})
		homeDir, err := os.UserHomeDir()
		if err != nil {
			panic("Couldn't create initial library")
		}
		videoDir := filepath.Join(homeDir, "Videos")
		library := Library{CanRemove: false, FolderPath: videoDir,Name: "Movies"}
		db.Create(&library)
	} else {
		ApiKey = userSettings.MovieDbApiKey
	}

	dbConnection = db
}

func GetDatabase() *gorm.DB {
	return dbConnection
}
