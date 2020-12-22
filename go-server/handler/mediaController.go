package handler

import (
	"github.com/asticode/go-astisub"
	"go-server/database"
	"os"
	"path/filepath"
	"strings"
)

func GetAllLibraryMedia(libraryId int) []MediaListItem {
	mediaItems := []database.MediaItem{}
	db := database.GetDatabase()
	db.Where(&database.MediaItem{LibraryId: libraryId}).Find(&mediaItems).Order("updated_at desc")
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

func GetMediaSubtitleInfo(mediaId int) []MediaSubtitle {
	var mediaItem database.MediaItem
	db := database.GetDatabase()
	db.First(&mediaItem, mediaId)
	var library database.Library
	db.First(&library, mediaItem.LibraryId)
	subs := []MediaSubtitle{}
	if filepath.Dir(mediaItem.FilePath) != filepath.Dir(library.FolderPath) {
		_ = filepath.Walk(filepath.Dir(mediaItem.FilePath), func(path string, info os.FileInfo, err error) error {
			if err == nil {
				if strings.HasSuffix(path, ".srt") ||
					strings.HasSuffix(path, ".ttml") ||
					strings.HasSuffix(path, ".stl") ||
					strings.HasSuffix(path, ".ssa") ||
					strings.HasSuffix(path, ".ass") ||
					strings.HasSuffix(path, ".teletext") {

					newPath := path
					newPath += ".vtt"
					_, err := os.Stat(newPath)
					if os.IsNotExist(err) {
						s1, _ := astisub.OpenFile(path)
						f, _ := os.Create(newPath)
						s1.WriteToWebVTT(f)
					}
					subs = append(subs, MediaSubtitle{
						FilePath: newPath,
						Language: filepath.Base(strings.TrimSuffix(newPath, ".vtt")),
					})
				}
			}
			return err
		})
	}

	return subs
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
