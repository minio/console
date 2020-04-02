default: build

build:
	@echo "Building frontend static assets to 'build'"
	yarn build
	go-bindata-assetfs -pkg portal build/...

