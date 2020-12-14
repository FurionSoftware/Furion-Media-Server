package main

import (
	"encoding/json"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"go-server/controllers"
	"go-server/database"
	"log"
	"net/http"
	"strconv"
)

func main() {
	database.InitDatabase()
	r := mux.NewRouter()
	SetupUserRoutes(r)
	SetupMediaRoutes(r)
	SetupLibraryRoutes(r)
	originsOk := handlers.AllowedOrigins([]string{"http://localhost:3000", "https://localhost:3001"})
	methodsOk := handlers.AllowedMethods([]string{"POST", "GET", "HEAD", "OPTIONS"})
	headersOk := handlers.AllowedHeaders([]string{"Access-Control-Allow-Headers", "Access-Control-Allow-Origin", "Accept", "Accept-Language", "Content-Type", "Range"})
	log.Fatal(http.ListenAndServe(":8000", handlers.CORS(originsOk, methodsOk, headersOk)(r)))
}

func SetupUserRoutes(r *mux.Router) {
	r.HandleFunc("/api/user/settings", func(w http.ResponseWriter, req *http.Request) {
		decoder := json.NewDecoder(req.Body)
		var updateUserSettings controllers.UpdateUserSettings
		err := decoder.Decode(&updateUserSettings)
		if err != nil {
			panic(err)
		}
		err = controllers.UpdateSettings(updateUserSettings)
		if err != nil {
			http.Error(w, err.Error(), 400)
		}
	}).Methods("POST")

	r.HandleFunc("/api/user/settings", func(w http.ResponseWriter, req *http.Request) {
		settings := controllers.GetUserSettings()
		json.NewEncoder(w).Encode(settings)
	}).Methods("GET")
}

func SetupMediaRoutes(r *mux.Router) {
	r.HandleFunc("/api/media/allmedia/{libraryId}", func(w http.ResponseWriter, req *http.Request) {
		vars := mux.Vars(req)
		libraryId, _ := strconv.Atoi(vars["libraryId"])
		mediaItems := controllers.GetAllLibraryMedia(libraryId)
		json.NewEncoder(w).Encode(mediaItems)
	}).Methods("GET")
	r.HandleFunc("/api/media/item/{mediaId}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		mediaId, _ := strconv.Atoi(vars["mediaId"])
		mediaListItem := controllers.GetMediaItem(mediaId)
		json.NewEncoder(w).Encode(mediaListItem)
	}).Methods("GET")

	r.HandleFunc("api/media/mediadata/{mediaId}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		mediaId, _ := strconv.Atoi(vars["mediaId"])
		filePath := controllers.GetFilePath(mediaId)
		http.ServeFile(w, r, filePath)
	}).Methods("GET")
}

func SetupLibraryRoutes(r *mux.Router) {
	r.HandleFunc("/api/libraries", func(w http.ResponseWriter, r *http.Request) {
		libraries := controllers.GetLibraries()
		json.NewEncoder(w).Encode(libraries)
	}).Methods("GET")

	r.HandleFunc("/api/libraries/{libraryName}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		libraryDetails, err := controllers.GetLibraryPageDetail(vars["libraryName"])
		if err != nil {
			http.Error(w, err.Error(), 400)
		}
		json.NewEncoder(w).Encode(libraryDetails)
	}).Methods("GET")

	r.HandleFunc("/api/libraries/reload", func(w http.ResponseWriter, r *http.Request) {

	}).Methods("POST")
}
