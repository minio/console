default: build-static

build-static:
	@echo "Building frontend static assets to 'build'"
	NODE_OPTIONS=--openssl-legacy-provider yarn build

test-warnings:
	./check-warnings.sh
