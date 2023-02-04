package models

type Album struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	Songs    []Song `json:"songs_id"`
	IsPublic bool   `json:"is_public"`
	ImageUrl string `json:"image_url"`
}
