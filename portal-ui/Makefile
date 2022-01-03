default: build-static

build-static:
	@echo "Building frontend static assets to 'build'"
	NODE_OPTIONS=--openssl-legacy-provider yarn build

test-warnings:
	if yarn build | grep "Compiled with warnings"; then echo "There are warnings in the code" && false ; else echo "All good"; fi