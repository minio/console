PWD := $(shell pwd)
GOPATH := $(shell go env GOPATH)
# Sets the build version based on the output of the following command, if we are building for a tag, that's the build else it uses the current git branch as the build
BUILD_VERSION:=$(shell git describe --exact-match --tags $(git log -n1 --pretty='%h') 2>/dev/null || git rev-parse --abbrev-ref HEAD 2>/dev/null)
BUILD_TIME:=$(shell date 2>/dev/null)
TAG ?= "minio/console:$(VERSION)-dev"

default: console

.PHONY: console
console:
	@echo "Building Console binary to './console'"
	@(GO111MODULE=on CGO_ENABLED=0 go build -trimpath --tags=kqueue --ldflags "-s -w" -o console ./cmd/console)

k8sdev:
	@docker build -t $(TAG) --build-arg build_version=$(BUILD_VERSION) --build-arg build_time='$(BUILD_TIME)' .
	@kind load docker-image $(TAG)
	@echo "Done, now restart your console deployment"

getdeps:
	@mkdir -p ${GOPATH}/bin
	@which golangci-lint 1>/dev/null || (echo "Installing golangci-lint" && curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(GOPATH)/bin v1.27.0)

verifiers: getdeps fmt lint

fmt:
	@echo "Running $@ check"
	@GO111MODULE=on gofmt -d cmd/
	@GO111MODULE=on gofmt -d pkg/

lint:
	@echo "Running $@ check"
	@GO111MODULE=on ${GOPATH}/bin/golangci-lint cache clean
	@GO111MODULE=on ${GOPATH}/bin/golangci-lint run --timeout=5m --config ./.golangci.yml

install: console
	@echo "Installing console binary to '$(GOPATH)/bin/console'"
	@mkdir -p $(GOPATH)/bin && cp -f $(PWD)/console $(GOPATH)/bin/console
	@echo "Installation successful. To learn more, try \"console --help\"."

swagger-gen:
	@echo "Generating swagger server code from yaml"
	@rm -rf models
	@rm -rf restapi/operations
	@swagger generate server -A console --main-package=console --exclude-main -P models.Principal -f ./swagger.yml -r NOTICE

assets:
	@(cd portal-ui; yarn install; make build-static; cd ..)

test:
	@(GO111MODULE=on go test -race -v github.com/minio/console/restapi/...)
	@(GO111MODULE=on go test -race -v github.com/minio/console/pkg/...)

coverage:
	@(GO111MODULE=on go test -v -coverprofile=coverage.out github.com/minio/console/restapi/... && go tool cover -html=coverage.out && open coverage.html)

clean:
	@echo "Cleaning up all the generated files"
	@find . -name '*.test' | xargs rm -fv
	@find . -name '*~' | xargs rm -fv
	@rm -vf console

docker:
	@docker build -t $(TAG) --build-arg build_version=$(BUILD_VERSION) --build-arg build_time='$(BUILD_TIME)' .
