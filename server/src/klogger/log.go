package klogger

import "fmt"

func Error(args ...interface{}) {
	fmt.Printf("Error: %s\n", args...)
}

func Warn(args ...interface{}) {
	fmt.Printf("WARNING: %s\n", args...)
}

func Info(args ...interface{}) {
	fmt.Printf("INFO: %s\n", args...)
}
