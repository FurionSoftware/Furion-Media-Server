package handler

import "time"

type UserSettings struct {
	Id            int       `json:"id"`
	Libraries     []Library `json:"libraries"`
	MovieDbApiKey string    `json:"movieDbApiKey"`
}

type Library struct {
	Id         int    `json:"id"`
	Name       string `json:"name"`
	CanRemove  bool   `json:"canRemove"`
	FolderPath string `json:"folderPath"`
}

type MediaSubtitle struct {
	FilePath string `json:"filePath"`
	Language string `json:"language"`
}

type UpdateUserSettings struct {
	NewLibraries      []Library `json:"newLibraries"`
	ExistingLibraries []Library `json:"existingLibraries"`
	RemovedLibraries  []Library `json:"removedLibraries"`
	MovieDbApiKey     string    `json:"movieDbApiKey"`
}

type UpdateLibrary struct {
	Id         int    `json:"id"`
	Name       string `json:"name"`
	FolderPath string `json:"folderPath"`
}

type MediaListItem struct {
	Id             int        `json:"id"`
	Title          string     `json:"title"`
	FilePath       string     `json:"filePath"`
	Duration       int        `json:"duration"`
	DurationPlayed int        `json:"durationPlayed"`
	ReleaseDate    *time.Time `json:"releaseDate"`
	ThumbnailUrl   *string    `json:"thumbnailUrl"`
	Overview       *string    `json:"overview"`
}

type MediaDetail struct {
	Id             int        `json:"id"`
	Title          string     `json:"title"`
	FilePath       string     `json:"filePath"`
	Duration       int        `json:"duration"`
	DurationPlayed int        `json:"durationPlayed"`
	ReleaseDate    *time.Time `json:"releaseDate"`
	ThumbnailUrl   *string    `json:"thumbnailUrl"`
	Overview       *string    `json:"overview"`
	Resolution     *string    `json:"resolution"`
	Language       *string    `json:"language"`
	Quality        *string    `json:"quality"`
	Audio          *string    `json:"audio"`
	Codec          *string    `json:"codec"`
}

type LibraryPageDetail struct {
	Id         int    `json:"id"`
	Name       string `json:"name"`
	FolderPath string `json:"folderPath"`
}
