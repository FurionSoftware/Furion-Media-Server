package main

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"go-server/database"
	"go-server/handler"
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
	//headersOk := handlers.AllowedHeaders([]string{"Access-Control-Allow-Headers", "Access-Control-Allow-Origin", "Accept", "Accept-Language", "Content-Type", "Range"})
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"POST", "GET", "HEAD", "OPTIONS"},
	})
	corsHandler := c.Handler(r)
	log.Fatal(http.ListenAndServe(":8000", corsHandler))
}

func SetupUserRoutes(r *mux.Router) {
	r.HandleFunc("/api/user/settings", func(w http.ResponseWriter, req *http.Request) {
		decoder := json.NewDecoder(req.Body)
		var updateUserSettings handler.UpdateUserSettings
		err := decoder.Decode(&updateUserSettings)
		if err != nil {
			panic(err)
		}
		err = handler.UpdateSettings(updateUserSettings)
		if err != nil {
			http.Error(w, err.Error(), 400)
		}
	}).Methods("POST")

	r.HandleFunc("/api/user/settings", func(w http.ResponseWriter, req *http.Request) {
		settings := handler.GetUserSettings()
		json.NewEncoder(w).Encode(settings)
	}).Methods("GET")
}

func SetupMediaRoutes(r *mux.Router) {
	r.HandleFunc("/api/media/allmedia/{libraryId}", func(w http.ResponseWriter, req *http.Request) {
		vars := mux.Vars(req)
		libraryId, _ := strconv.Atoi(vars["libraryId"])
		mediaItems := handler.GetAllLibraryMedia(libraryId)
		json.NewEncoder(w).Encode(mediaItems)
	}).Methods("GET")
	r.HandleFunc("/api/media/detail/{mediaId}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		mediaId, _ := strconv.Atoi(vars["mediaId"])
		mediaListItem := handler.GetMediaDetail(mediaId)
		json.NewEncoder(w).Encode(mediaListItem)
	}).Methods("GET")

	r.HandleFunc("/api/media/mediadata/{mediaId}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		mediaId, _ := strconv.Atoi(vars["mediaId"])
		filePath := handler.GetFilePath(mediaId)
		http.ServeFile(w, r, filePath)
	}).Methods("GET")
	r.HandleFunc("/api/media/initialduration/{mediaId}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		mediaId, _ := strconv.Atoi(vars["mediaId"])
		duration, _ := strconv.ParseFloat(r.URL.Query().Get("duration"), 64)
		handler.SetInitialMediaDuration(mediaId, duration)

	}).Methods("POST")
	r.HandleFunc("/api/media/updateplayedseconds/{mediaId}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		mediaId, _ := strconv.Atoi(vars["mediaId"])
		playedSeconds, _ := strconv.ParseFloat(r.URL.Query().Get("playedSeconds"), 64)
		handler.UpdatePlayedSeconds(mediaId, playedSeconds)
	}).Methods("POST")
	r.HandleFunc("/api/media/subtitleinfo/{mediaId}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		mediaId, _ := strconv.Atoi(vars["mediaId"])
		subs := handler.GetMediaSubtitleInfo(mediaId)
		json.NewEncoder(w).Encode(subs)
	}).Methods("GET")

	r.HandleFunc("/api/getfile", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Query().Get("filepath")
		http.ServeFile(w, r, path)
	})
	//
	//r.HandleFunc("/api/getsubtitlefile", func(w http.ResponseWriter, r *http.Request) {
	//	path := r.URL.Query().Get("filepath")
	//	filepath := handler.ParseSubtitle(path)
	//	http.ServeFile(w, r, filepath)
	//})
}

func SetupLibraryRoutes(r *mux.Router) {
	r.HandleFunc("/api/libraries", func(w http.ResponseWriter, r *http.Request) {
		libraries := handler.GetLibraries()
		json.NewEncoder(w).Encode(libraries)
	}).Methods("GET")

	r.HandleFunc("/api/libraries/{libraryName}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		libraryDetails, err := handler.GetLibraryPageDetail(vars["libraryName"])
		if err != nil {
			http.Error(w, err.Error(), 400)
		}
		json.NewEncoder(w).Encode(libraryDetails)
	}).Methods("GET")

	r.HandleFunc("/api/libraries/reload", func(w http.ResponseWriter, r *http.Request) {
		err := handler.ReloadLibraries()
		if err != nil {
			http.Error(w, err.Error(), 400)
		}
	}).Methods("POST")
	r.HandleFunc("/api/libraries/recentmedia/{libraryId}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		libraryId, _ := strconv.Atoi(vars["libraryId"])
		media := handler.GetRecentMedia(libraryId)
		json.NewEncoder(w).Encode(media)
	}).Methods("GET")
}
