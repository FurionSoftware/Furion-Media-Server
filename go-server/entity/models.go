package entity

import (
	"gorm.io/gorm"
	"time"
)

type UserSettings struct {
	gorm.Model
	Id int
	MovieDbApiKey string
}

type MediaItem struct {
	gorm.Model
	Id int
	Title string
	LibraryId int
	FilePath string
	Duration       int
	DurationPlayed int
	ReleaseDate    *time.Time
	ThumbnailUrl   *string
	Overview       *string
	Resolution     *string
	Language       *string
	Quality        *string
	Audio          *string
	Codec          *string
	Library        Library
	UpdatedAt      time.Time
	Genres         []Genre `gorm:"many2many:media_item_genres"`
}

type Genre struct {
	gorm.Model
	Id int
	Name string
}

type Library struct {
	gorm.Model
	Id int
	Name string
	CanRemove bool
	FolderPath string
	MediaItems []MediaItem
}