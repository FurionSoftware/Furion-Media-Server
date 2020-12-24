package database

import (
	"go-server/entity"
	"go-server/moviedb"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"os"
	"path/filepath"
)

var dbConnection *gorm.DB

func InitDatabase() {
	db, err := gorm.Open(sqlite.Open("Furion Media Server.db"), &gorm.Config{
		SkipDefaultTransaction: true,
	})
	if err != nil {
		panic("Failed to connect to database")
	}

	db.AutoMigrate(&entity.UserSettings{}, &entity.MediaItem{}, &entity.Library{}, &entity.Genre{})
	userSettings := entity.UserSettings{}
	result := db.First(&userSettings)
	if result.Error != nil {
		db.Create(&entity.UserSettings{})
		homeDir, err := os.UserHomeDir()
		if err != nil {
			panic("Couldn't create initial library")
		}
		videoDir := filepath.Join(homeDir, "Videos")
		library := entity.Library{CanRemove: false, FolderPath: videoDir, Name: "Movies"}
		db.Create(&library)
		genres := addGenres()
		db.Create(&genres)

	} else {
		moviedb.ApiKey = userSettings.MovieDbApiKey
	}

	dbConnection = db
}

func GetDatabase() *gorm.DB {
	return dbConnection
}

func addGenres() []entity.Genre {
	genres := []entity.Genre{
		{
			Id:   28,
			Name: "Action",
		},
		{
			Id:   12,
			Name: "Adventure",
		},
		{
			Id:   16,
			Name: "Animation",
		},
		{
			Id:   35,
			Name: "Comedy",
		},
		{
			Id:   80,
			Name: "Crime",
		},
		{
			Id:   99,
			Name: "Documentary",
		},
		{
			Id:   18,
			Name: "Drama",
		},
		{
			Id:   10751,
			Name: "Family",
		},
		{
			Id:   14,
			Name: "Fantasy",
		},
		{
			Id:   36,
			Name: "History",
		},
		{
			Id:   27,
			Name: "Horror",
		},
		{
			Id:   10402,
			Name: "Music",
		},
		{
			Id:   9648,
			Name: "Mystery",
		},
		{
			Id:   10749,
			Name: "Romance",
		},
		{
			Id:   878,
			Name: "Science Fiction",
		},
		{
			Id:   10770,
			Name: "TV Movie",
		},
		{
			Id:   53,
			Name: "Thriller",
		},
		{
			Id:   10752,
			Name: "War",
		},
		{
			Id:   37,
			Name: "Western",
		},
	}
	return genres
}
