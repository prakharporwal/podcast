package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/prakharporwal/spotify-backend/klogger"
)

func GetSong(ctx *gin.Context) {
	klogger.Info("inside GetArtist!")
	ctx.JSON(http.StatusOK, "hello")
}
