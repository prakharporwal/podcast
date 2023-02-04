package models

type Artist struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	AlbumId  string `json:"album_id"`
	ImageUrl string `json:"image_url"`
}
