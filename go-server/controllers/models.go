package controllers

type UserSettings struct {
	Id        int       `json:"id"`
	Libraries []Library `json:"libraries"`
}

type Library struct {
	Id         int    `json:"id"`
	Name       string `json:"name"`
	CanRemove  bool   `json:"canRemove"`
	FolderPath string `json:"folderPath"`
}

type UpdateUserSettings struct {
	NewLibraries      []Library `json:"newLibraries"`
	ExistingLibraries []Library `json:"existingLibraries"`
	RemovedLibraries  []Library `json:"removedLibraries"`
}

type UpdateLibrary struct {
	Id         int    `json:"id"`
	Name       string `json:"name"`
	FolderPath string `json:"folderPath"`
}

type MediaListItem struct {
	Id             int    `json:"id"`
	Title          string `json:"title"`
	FilePath       string `json:"filePath"`
	Duration       int    `json:"duration"`
	DurationPlayed int    `json:"durationPlayed"`
}

type LibraryPageDetail struct {
	Id         int    `json:"id"`
	Name       string `json:"name"`
	FolderPath string `json:"folderPath"`
}
