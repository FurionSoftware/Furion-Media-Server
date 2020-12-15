package handler

import (
	"go-server/database"
)

func GetAllLibraryMedia(libraryId int) []MediaListItem {
	mediaItems := []database.MediaItem{}
	db := database.GetDatabase()
	db.Where(&database.MediaItem{LibraryId: libraryId}).Find(&mediaItems)
	mediaListItems := []MediaListItem{}
	for _, mediaItem := range mediaItems {
		mediaListItems = append(mediaListItems, MediaListItem{Id: mediaItem.Id, Title: mediaItem.Title, Duration: mediaItem.Duration, DurationPlayed: mediaItem.DurationPlayed, FilePath: mediaItem.FilePath})
	}
	return mediaListItems
}

func GetMediaItem(mediaId int) MediaListItem {
	var mediaItem database.MediaItem
	db := database.GetDatabase()
	db.First(&mediaItem, mediaId)
	mediaItemDto := MediaListItem{
		Id:             mediaItem.Id,
		Title:          mediaItem.Title,
		FilePath:       mediaItem.FilePath,
		Duration:       mediaItem.Duration,
		DurationPlayed: mediaItem.DurationPlayed,
	}
	return mediaItemDto
}

func GetFilePath(mediaId int) string {
	var mediaItem database.MediaItem
	db := database.GetDatabase()
	db.First(&mediaItem, mediaId)
	return mediaItem.FilePath
}

func SetInitialMediaDuration(mediaId int, duration float64) {
	var mediaItem database.MediaItem
	db := database.GetDatabase()
	db.First(&mediaItem, mediaId)
	mediaItem.Duration = int(duration)
	db.Save(&mediaItem)
}

func UpdatePlayedSeconds(mediaId int, playedSeconds float64) {
	var mediaItem database.MediaItem
	db := database.GetDatabase()
	db.First(&mediaItem, mediaId)
	mediaItem.DurationPlayed = int(playedSeconds)
	db.Save(&mediaItem)
}
