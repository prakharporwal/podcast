package models

type Song struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	ImageUrl string `json:"image_url"`
	Artist   string `json:"artist"`
}
