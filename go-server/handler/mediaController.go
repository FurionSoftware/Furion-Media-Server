package handler

import (
	"github.com/asticode/go-astisub"
	"go-server/database"
	"golang.org/x/text/language"
	"os"
	"path/filepath"
	"strconv"
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
	_ = filepath.Walk(library.FolderPath, func(path string, info os.FileInfo, err error) error {
		if err == nil {
			if strings.HasSuffix(path, ".srt") ||
				strings.HasSuffix(path, ".ttml") ||
				strings.HasSuffix(path, ".stl") ||
				strings.HasSuffix(path, ".ssa") ||
				strings.HasSuffix(path, ".ass") ||
				strings.HasSuffix(path, ".teletext") {
				var yearStr string
				var resolution string
				var codec string
				if mediaItem.ReleaseDate != nil {
					yearStr = strconv.Itoa(mediaItem.ReleaseDate.Year())
				}

				if mediaItem.Codec != nil {
					codec = *mediaItem.Codec
				}

				if mediaItem.Resolution != nil {
					resolution = *mediaItem.Resolution
				}

				if strings.Contains(path, mediaItem.Title) && strings.Contains(path, yearStr) && strings.Contains(path, resolution) && strings.Contains(path, codec) {
					s1, _ := astisub.OpenFile(path)
					newPath := strings.TrimSuffix(path, filepath.Ext(path))
					newPath += ".vtt"
					f, _ := os.Create(newPath)
					s1.WriteToWebVTT(f)
					lang := "en"
					if s1.Metadata != nil {
						lang = s1.Metadata.Language
					} else {
						split := strings.Split(path, ".")
						if len(split) > 1 {
							tag, err := language.Parse(split[len(split)-2])
							if err != nil {
								lang = strings.ToLower(tag.String())
							}
						}
					}
					subs = append(subs, MediaSubtitle{
						FilePath: newPath,
						Language: lang,
					})
				} else if strings.HasSuffix(path, ".vtt") {

				}
			}
		}
		return err
	})
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
