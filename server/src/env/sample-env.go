package env

// remove the starting s from all the var name

import "os"

func sGetFromEnv(key string, defaultValue string) string {
	osValue := os.Getenv(key)
	if osValue != "" {
		return osValue
	}
	return defaultValue
}

var (
	sGinMode       = GetFromEnv("GinMode", "debug")
	sProdDBSource  = GetFromEnv("ProdDBSource", "dev-spotify-instance-1.cpqupnub0omn.us-east-1.rds.amazonaws.com")
	sDbUser        = GetFromEnv("DbUser", "user")
	sDbPassword    = GetFromEnv("DbPassword", "pass")
	sDbName        = GetFromEnv("DbName", "db")
	sDbPort        = GetFromEnv("DbPort", "5432")
	sDbDriver      = GetFromEnv("DbDriver", "postgres")
	sAppEnv        = GetFromEnv("AppEnv", "lambda")
	sServerAddress = GetFromEnv("ServerAddress", "localhost")
	sServerPort    = GetFromEnv("ServerPort", "8080")
)
