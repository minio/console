default: build-static

build-static:
	@echo "Building frontend static assets to 'build'"
	NODE_OPTIONS=--openssl-legacy-provider yarn build

test-warnings:
	./check-warnings.sh

test-prettier:
	./check-prettier.sh

prettify:
	yarn prettier --write . --loglevel warn
