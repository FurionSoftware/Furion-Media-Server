package handler

import (
	"errors"
	"go-server/database"
	"go-server/entity"
	"go-server/moviedb"
	"os"
)

func GetUserSettings() UserSettings {
	db := database.GetDatabase()
	var userSettingsEntity entity.UserSettings
	db.First(&userSettingsEntity)
	var libraries []entity.Library
	db.Find(&libraries)
	var librariesDto []Library
	for _, library := range libraries {
		librariesDto = append(librariesDto, Library{Id: library.Id, Name: library.Name,
			CanRemove: library.CanRemove, FolderPath: library.FolderPath})
	}
	userSettings := UserSettings{
		Id:            userSettingsEntity.Id,
		Libraries:     librariesDto,
		MovieDbApiKey: userSettingsEntity.MovieDbApiKey,
	}
	return userSettings
}

func UpdateSettings(updateUserSettings UpdateUserSettings) error {
	for _, library := range append(updateUserSettings.ExistingLibraries, updateUserSettings.NewLibraries...) {
		_, err := os.Stat(library.FolderPath)
		if err == nil {
			continue
		}
		if os.IsNotExist(err) {
			return errors.New("The specified folder path is invalid")
		}
	}

	db := database.GetDatabase()
	var userSettings entity.UserSettings
	db.First(&userSettings)
	userSettings.MovieDbApiKey = updateUserSettings.MovieDbApiKey
	moviedb.ApiKey = updateUserSettings.MovieDbApiKey
	db.Save(&userSettings)
	for _, library := range append(updateUserSettings.ExistingLibraries, updateUserSettings.NewLibraries...) {
		var libraryEntity entity.Library
		result := db.Where(&Library{Name: library.Name}).First(&libraryEntity)
		if result.Error == nil {
			libraryEntity.FolderPath = library.FolderPath
			libraryEntity.Name = library.Name
			db.Save(&libraryEntity)
		} else {
			return result.Error
		}
	}

	addedLibraries := []entity.Library{}
	for _, library := range updateUserSettings.NewLibraries {
		addedLibraries = append(addedLibraries, entity.Library{Name: library.Name, FolderPath: library.FolderPath, CanRemove: true})
	}
	db.Create(&addedLibraries)

	for _, library := range updateUserSettings.RemovedLibraries {
		db.Where(&entity.MediaItem{LibraryId: library.Id}).Unscoped().Delete(entity.MediaItem{})
		db.Unscoped().Delete(&entity.Library{}, library.Id)
	}
	return nil
}
