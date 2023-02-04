package db

import (
	"database/sql"

	_ "github.com/lib/pq"
	"github.com/prakharporwal/spotify-backend/env"
	"github.com/prakharporwal/spotify-backend/klogger"
)

const (
	dbDriver = "postgres"
)

// TODO: can be use to make it thread safe
// var lock = &sync.Mutex{}

var conn **sql.DB

func GetInstance() *sql.DB {
	if conn == nil {
		dbSource := env.DbDriver + "://" + env.DbUser + ":" + env.DbPassword + "@" + env.ProdDBSource + ":" + env.DbPort + "/" + env.DbName
		// dbSource := env.DBSource
		x, err := sql.Open(dbDriver, dbSource)
		conn = &x
		if err != nil {
			klogger.Error("Connection to DB failed !", err)
			panic(err)
		}
		klogger.Info("\nSuccessfully connected to database!\n")
	} else {
		klogger.Info("Singleton Present Already!")
	}

	return *conn
}
