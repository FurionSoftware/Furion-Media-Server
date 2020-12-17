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
		mediaListItems = append(mediaListItems, MediaListItem{
			Id:             mediaItem.Id,
			Title:          mediaItem.Title,
			FilePath:       mediaItem.FilePath,
			Duration:       mediaItem.Duration,
			DurationPlayed: mediaItem.DurationPlayed,
			ReleaseDate:    mediaItem.ReleaseDate,
			ThumbnailUrl:   mediaItem.ThumbnailUrl,
			Overview:       mediaItem.Overview,
		})
	}
	return mediaListItems
}

func GetMediaDetail(mediaId int) MediaDetail {
	var mediaItem database.MediaItem
	db := database.GetDatabase()
	db.First(&mediaItem, mediaId)
	mediaItemDto := MediaDetail{
		Id:             mediaItem.Id,
		Title:          mediaItem.Title,
		FilePath:       mediaItem.FilePath,
		Duration:       mediaItem.Duration,
		DurationPlayed: mediaItem.DurationPlayed,
		Overview:       mediaItem.Overview,
		ThumbnailUrl:   mediaItem.ThumbnailUrl,
		ReleaseDate:    mediaItem.ReleaseDate,
		Audio:          mediaItem.Audio,
		Codec:          mediaItem.Codec,
		Quality:        mediaItem.Quality,
		Language:       mediaItem.Language,
		Resolution:     mediaItem.Resolution,
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
