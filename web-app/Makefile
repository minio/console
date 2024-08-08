default: build-static

build-static:
	@echo "Building frontend static assets to 'build'"
	@if [ -f "${NVM_DIR}/nvm.sh" ]; then \. "${NVM_DIR}/nvm.sh" && nvm install && nvm use; fi && \
	  yarn build

build-static-istanbul-coverage:
	@echo "Building frontend static assets to 'build'"
	@if [ -f "${NVM_DIR}/nvm.sh" ]; then \. "${NVM_DIR}/nvm.sh" && nvm install && nvm use; fi && \
	  yarn buildistanbulcoverage

test-warnings:
	./check-warnings.sh

test-prettier:
	./check-prettier.sh

find-deadcode:
	./check-deadcode.sh

prettify:
	yarn prettier --write . --log-level warn

pretty: prettify
