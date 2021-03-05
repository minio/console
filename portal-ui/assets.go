package portal_ui

import "embed"

//go:embed build/*
var fs embed.FS

func GetStaticAssets() embed.FS {
	return fs
}
