package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/prakharporwal/spotify-backend/db"
	"github.com/prakharporwal/spotify-backend/klogger"
	"github.com/prakharporwal/spotify-backend/models"
)

func GetAlbum(ctx *gin.Context) {
	klogger.Info("inside GetAlbum!")

	songList1 := []models.Song{
		{
			Name:     "Just Play Now",
			ImageUrl: "images/song-damn.jpg",
			Artist:   "Mr Bean",
		},
		{
			Name:     "Just Play Now",
			ImageUrl: "images/song-damn.jpg",
			Artist:   "Mr Bean",
		},
	}

	res := []models.Album{
		{
			Id:    "anjsax",
			Name:  "Recently Played",
			Songs: songList1,
		},
		{
			Id:    "radome",
			Name:  "Your mixes",
			Songs: songList1,
		},
	}

	album, err := db.GetAllAlbums()
	// network call lag
	// song, err := db.GetSongsFromIdList([]int{1, 2, 3})

	if err != nil {
		klogger.Error(err)
		ctx.JSON(http.StatusInternalServerError, res)
	}

	ctx.JSON(http.StatusOK, album)
}
