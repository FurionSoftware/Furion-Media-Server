package controllers

import (
	"errors"
	"go-server/database"
	"strings"
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

