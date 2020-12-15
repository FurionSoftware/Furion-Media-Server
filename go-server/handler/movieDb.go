package handler

import (
	"encoding/json"
	"go-server/database"
	"log"
	"net/http"
)

type SearchMovieResult struct {
	Page    int `json:"page"`
	Results []SearchMovieItem `json:"results"`
	TotalResults int `json:"total_results"`
	TotalPages int `json:"total_pages"`
}

type SearchMovieItem struct {
	Title       string    `json:"title"`
	ReleaseDate string `json:"release_date"`
	Overview    string    `json:"overview"`
	PosterPath  string    `json:"poster_path"`
}

const baseApiUrl = "https://api.themoviedb.org/3"

func SearchMovie(query string) (searchMovieResult SearchMovieResult, err error) {
	req, err := http.NewRequest("GET", baseApiUrl+"/search/movie", nil)
	if err != nil {
		log.Println(err)
		return searchMovieResult, err
	}
	q := req.URL.Query()
	q.Add("api_key", database.ApiKey)
	q.Add("query", query)
	req.URL.RawQuery = q.Encode()
	resp, err := http.Get(req.URL.String())
	if err != nil {
		return searchMovieResult, err
	}
	defer resp.Body.Close()
	json.NewDecoder(resp.Body).Decode(&searchMovieResult)
	return searchMovieResult, nil
}
