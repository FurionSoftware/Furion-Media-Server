package database

import "gorm.io/gorm"

type UserSettings struct {
	gorm.Model
	Id int
}

type MediaItem struct {
	gorm.Model
	Id int
	Title string
	LibraryId int
	FilePath string
	Duration int
	DurationPlayed int
	Library Library
}

type Library struct {
	gorm.Model
	Id int
	Name string
	CanRemove bool
	FolderPath string
	MediaItems []MediaItem
}