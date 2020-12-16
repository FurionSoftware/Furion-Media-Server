package utility

import (
	"fmt"
	"time"
)

func Elapsed(what string) func() {
	start := time.Now()
	return func() {
		fmt.Println("%s took %v\n", what, time.Since(start))
	}
}