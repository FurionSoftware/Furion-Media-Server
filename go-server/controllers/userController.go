package controllers

import (
	"errors"
	"go-server/database"
	"os"
)

func GetUserSettings() UserSettings {
	db := database.GetDatabase()
	var userSettingsEntity database.UserSettings
	db.First(&userSettingsEntity)
	var libraries []database.Library
	db.Find(&libraries)
	var librariesDto []Library
	for _, library := range libraries {
		librariesDto = append(librariesDto, Library{Id: library.Id, Name: library.Name,
			CanRemove: library.CanRemove, FolderPath: library.FolderPath})
	}
	userSettings := UserSettings{
		Id:        userSettingsEntity.Id,
		Libraries: librariesDto,
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
	for _, library := range append(updateUserSettings.ExistingLibraries, updateUserSettings.NewLibraries...) {
		var libraryEntity database.Library
		result := db.Where(&Library{Name: library.Name}).First(&libraryEntity)
		if result.Error != nil {
			libraryEntity.FolderPath = library.FolderPath
			libraryEntity.Name = library.Name
			db.Save(&libraryEntity)
		} else {
			return result.Error
		}
	}

	addedLibraries := []database.Library{}
	for _, library := range updateUserSettings.NewLibraries {
		addedLibraries = append(addedLibraries, database.Library{Name: library.Name, FolderPath: library.FolderPath, CanRemove: true})
	}
	db.Create(&addedLibraries)

	for _, library := range updateUserSettings.RemovedLibraries {
		db.Where(&database.MediaItem{LibraryId: library.Id}).Delete(database.MediaItem{})
		db.Delete(&database.Library{}, library.Id)
	}
	return nil
}
