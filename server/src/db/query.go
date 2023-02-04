package db

import (
	"github.com/lib/pq"
	"github.com/prakharporwal/spotify-backend/klogger"
	"github.com/prakharporwal/spotify-backend/models"
)

func GetAllAlbums() ([]models.Album, error) {
	var response []models.Album
	query := "select id, name, image_url, is_public from p_album"

	rows, err := GetInstance().Query(query)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var res models.Album
		err := rows.Scan(
			&res.Id,
			&res.Name,
			&res.ImageUrl,
			&res.IsPublic,
		)
		if err != nil {
			klogger.Error("Error Scanning All Results!", err)
			return nil, err
		}
		response = append(response, res)
	}
	return response, nil
}

func GetSongsFromIdList(songIdList []int) ([]models.Song, error) {
	var response []models.Song
	query := "select id, name, image_url FROM p_song where id=any($1)"

	rows, err := GetInstance().Query(query, pq.Array(songIdList))
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var res models.Song
		err := rows.Scan(
			&res.Id,
			&res.Name,
			&res.ImageUrl,
		)
		if err != nil {
			klogger.Error("Error Scanning All Results!", err)
			return nil, err
		}
		response = append(response, res)
	}
	return response, nil
}
