package handler

import (
	"errors"
	"fmt"
	"go-server/database"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func GetLibraries() []Library {
	db := database.GetDatabase()
	libraryEntities := []database.Library{}
	db.Find(&libraryEntities)
	var libraries []Library
	for _, library := range libraryEntities {
		libraries = append(libraries, Library{
			Id:         library.Id,
			Name:       library.Name,
			CanRemove:  library.CanRemove,
			FolderPath: library.FolderPath,
		})
	}
	return libraries
}

func GetLibraryPageDetail(libraryName string) (LibraryPageDetail, error) {
	db := database.GetDatabase()
	var library database.Library
	result := db.Where("upper(name) = ?", strings.ToUpper(libraryName)).First(&library)
	if result.Error == nil {
		pageDetail := LibraryPageDetail{
			Id:         library.Id,
			Name:       library.Name,
			FolderPath: library.FolderPath,
		}
		return pageDetail, nil
	}
	return LibraryPageDetail{}, errors.New("Library name doesn't exist")
}

func ReloadLibraries() error {
	db := database.GetDatabase()
	libraries := []database.Library{}
	db.Where("name is not null and name != ''").Find(&libraries)

	for _, library := range libraries {
		_, err := os.Stat(library.FolderPath)
		if os.IsNotExist(err) {
			return errors.New(fmt.Sprintf("Cannot refresh library %s, path not found", library.FolderPath))
		}

		filePaths := []string{}
		err = filepath.Walk(library.FolderPath, func(path string, info os.FileInfo, err error) error {
			if err == nil {
				if strings.HasSuffix(path, ".mp4") || strings.HasSuffix(path, ".ogg") || strings.HasSuffix(path, ".wav") || strings.HasSuffix(path, ".webm") {
					filePaths = append(filePaths, path)
				}
			}
			return err
		})
		mediaItems := []database.MediaItem{}
		db.Where(&database.MediaItem{LibraryId: library.Id}).Find(&mediaItems)

		for _, path := range filePaths {
			matchingMedia := []database.MediaItem{}
			db.Where(&database.MediaItem{FilePath: path}).Find(&matchingMedia)
			if len(matchingMedia) == 0 {
				filename := filepath.Base(path)
				basename := strings.TrimSuffix(filename, filepath.Ext(filename))
				mediaItem := database.MediaItem{
					Title:     basename,
					LibraryId: library.Id,
					FilePath:  path,
				}
				SetMediaMetadata(basename, &mediaItem)

				db.Create(&mediaItem)
			}
		}

		for _, item := range mediaItems {
			if !strings.HasPrefix(item.FilePath, library.FolderPath) {
				db.Delete(&item)
			} else {
				_, err := os.Stat(item.FilePath)
				if os.IsNotExist(err) {
					db.Delete(&item)
				}
			}
		}

	}
	return nil
}



func SetMediaMetadata(filenameNoExt string, mediaItem *database.MediaItem) {
	result, err := SearchMovie(filenameNoExt)
	if err == nil && len(result.Results) > 0 {
		mediaItem.Title = result.Results[0].Title
		releaseDate, err := time.Parse("2006-01-02", result.Results[0].ReleaseDate)
		if err == nil {
			mediaItem.ReleaseDate = &releaseDate
		}
		mediaItem.Overview = &result.Results[0].Overview
		mediaItem.ThumbnailUrl = &result.Results[0].PosterPath
	}

}
