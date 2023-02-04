package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/prakharporwal/spotify-backend/klogger"
)

func GetArtist(ctx *gin.Context) {
	klogger.Info("inside GetArtist!")
	//query DB get artist table entries
	ctx.JSON(http.StatusOK, gin.H{"out": "damn!"})
}
