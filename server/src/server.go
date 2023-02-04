package main

import (
	"github.com/gin-gonic/gin"
	"github.com/prakharporwal/spotify-backend/env"
	"github.com/prakharporwal/spotify-backend/klogger"
)

type Server struct {
	router *gin.Engine
}

func NewServer() *Server {
	server := &Server{
		router: initRouter(),
	}
	return server
}

func (server *Server) Start() error {
	klogger.Info("Starting Server!")
	return server.router.Run(env.ServerAddress + ":" + env.ServerPort)
}

func (server *Server) Stop() {
	klogger.Info("Stopping Server!")
}
