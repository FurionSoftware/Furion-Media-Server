package moviedb

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
)

type SearchMovieResult struct {
	Page         int               `json:"page"`
	Results      []SearchMovieItem `json:"results"`
	TotalResults int               `json:"total_results"`
	TotalPages   int               `json:"total_pages"`
}

type SearchMovieItem struct {
	Title       string `json:"title"`
	ReleaseDate string `json:"release_date"`
	Overview    string `json:"overview"`
	PosterPath  string `json:"poster_path"`
	Runtime     int    `json:"runtime"`
	Id          int    `json:"id"`
	GenreIds    []int  `json:"genre_ids"`
}

type MovieDetail struct {
	Runtime int `json:"runtime"`
}

const baseApiUrl = "https://api.themoviedb.org/3"

var ApiKey string

func SearchMovie(query string, year *int) (searchMovieResult SearchMovieResult, err error) {
	req, err := http.NewRequest("GET", baseApiUrl+"/search/movie", nil)
	if err != nil {
		log.Println(err)
		return searchMovieResult, err
	}
	q := req.URL.Query()
	q.Add("api_key", ApiKey)
	q.Add("query", query)
	if year != nil {
		q.Add("year", strconv.Itoa(*year))
	}
	req.URL.RawQuery = q.Encode()
	resp, err := http.Get(req.URL.String())
	if err != nil {
		return searchMovieResult, err
	}
	defer resp.Body.Close()
	json.NewDecoder(resp.Body).Decode(&searchMovieResult)
	if len(searchMovieResult.Results) > 0 {
		for i, item := range searchMovieResult.Results {
			req, err := http.NewRequest("GET", baseApiUrl+"/movie/"+strconv.Itoa(item.Id), nil)
			if err == nil {
				q = req.URL.Query()
				q.Add("api_key", ApiKey)
				req.URL.RawQuery = q.Encode()
				resp, err := http.Get(req.URL.String())
				if err == nil {
					detail := MovieDetail{}
					json.NewDecoder(resp.Body).Decode(&detail)
					searchMovieResult.Results[i].Runtime = detail.Runtime * 60
					resp.Body.Close()
				}
			}
		}
	}

	return searchMovieResult, nil
}
