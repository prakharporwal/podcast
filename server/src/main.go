package main

import (
	"context"
	"runtime/debug"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-gonic/gin"
	"github.com/prakharporwal/spotify-backend/api"
	"github.com/prakharporwal/spotify-backend/env"
	"github.com/prakharporwal/spotify-backend/klogger"
)

var ginLambda *ginadapter.GinLambda = nil
var apiGatewayRequest events.APIGatewayProxyRequest
var userName string

func init() {
	gin.SetMode(env.GinMode)
}

func main() {
	if env.AppEnv == "localhost" {
		server := NewServer()
		defer server.Stop()
		err := server.Start()
		if err != nil {
			klogger.Error(err)
			return
		}
	} else {
		klogger.Info("Hello Lambda Started!")
		lambda.Start(handler)
	}
}

func handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	klogger.Info("Inside handler!")
	klogger.Info(req)
	// finally block (weird!)
	defer func() {
		if err := recover(); err != nil {
			klogger.Error("in finally block. ", err, " stack:", string(debug.Stack()))
		}
	}()
	resp, err := handlerInternal(ctx, req)
	if err != nil {
		klogger.Error("unexpected error", err)
	}
	return resp, err
}

func handlerInternal(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	klogger.Info("Inside handler internal!")
	apiGatewayRequest = req

	if ginLambda == nil {
		initGinLambda()
	}

	return ginLambda.ProxyWithContext(ctx, req)
}

func initRouter() *gin.Engine {
	klogger.Info("Gin cold start")
	r := gin.Default()

	r.Use(CORSMiddleware())

	r.GET("/artist", api.GetArtist)
	r.GET("/album", api.GetAlbum)
	r.GET("/song", api.GetSong)
	return r
}

func initGinLambda() {
	r := initRouter()
	ginLambda = ginadapter.New(r)
}
