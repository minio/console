default: build-static

build-static:
	@echo "Building frontend static assets to 'build'"
	yarn build
	go-bindata-assetfs -pkg portal build/...

