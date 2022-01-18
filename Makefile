PWD := $(shell pwd)
GOPATH := $(shell go env GOPATH)
# Sets the build version based on the output of the following command, if we are building for a tag, that's the build else it uses the current git branch as the build
BUILD_VERSION:=$(shell git describe --exact-match --tags $(git log -n1 --pretty='%h') 2>/dev/null || git rev-parse --abbrev-ref HEAD 2>/dev/null)
BUILD_TIME:=$(shell date 2>/dev/null)
TAG ?= "minio/console:$(BUILD_VERSION)-dev"
MINIO_VERSION ?= "quay.io/minio/minio:latest"

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
	@which golangci-lint 1>/dev/null || (echo "Installing golangci-lint" && curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(GOPATH)/bin v1.40.1)

verifiers: getdeps fmt lint

fmt:
	@echo "Running $@ check"
	@GO111MODULE=on gofmt -d restapi/
	@GO111MODULE=on gofmt -d pkg/
	@GO111MODULE=on gofmt -d cmd/
	@GO111MODULE=on gofmt -d cluster/

crosscompile:
	@(env bash $(PWD)/cross-compile.sh $(arg1))

lint:
	@echo "Running $@ check"
	@GO111MODULE=on ${GOPATH}/bin/golangci-lint cache clean
	@GO111MODULE=on ${GOPATH}/bin/golangci-lint run --timeout=5m --config ./.golangci.yml

install: console
	@echo "Installing console binary to '$(GOPATH)/bin/console'"
	@mkdir -p $(GOPATH)/bin && cp -f $(PWD)/console $(GOPATH)/bin/console
	@echo "Installation successful. To learn more, try \"console --help\"."

swagger-gen: clean-swagger swagger-console swagger-operator
	@echo "Done Generating swagger server code from yaml"

clean-swagger:
	@echo "cleaning"
	@rm -rf models
	@rm -rf restapi/operations
	@rm -rf operatorapi/operations

swagger-console:
	@echo "Generating swagger server code from yaml"
	@swagger generate server -A console --main-package=management --server-package=restapi --exclude-main -P models.Principal -f ./swagger-console.yml -r NOTICE

swagger-operator:
	@echo "Generating swagger server code from yaml"
	@swagger generate server -A operator --main-package=operator --server-package=operatorapi --exclude-main -P models.Principal -f ./swagger-operator.yml -r NOTICE

assets:
	@(cd portal-ui; yarn install; make build-static; yarn prettier --write . --loglevel warn; cd ..)

test-integration:
	@echo "docker run with MinIO Version below:"
	@echo $(MINIO_VERSION)
	@(docker run -d --name minio --rm -p 9000:9000 $(MINIO_VERSION) server /data{1...4} && sleep 5)
	@(GO111MODULE=on go test -race -v github.com/minio/console/integration/...)
	@(docker stop minio)

test-permissions:
	@(docker run -d --name minio --rm -p 9000:9000 quay.io/minio/minio:latest server /data{1...4})
	@(env bash $(PWD)/portal-ui/tests/scripts/permissions.sh)
	@(docker stop minio)

initialize-permissions:
	@(docker run -d --name minio --rm -p 9000:9000 quay.io/minio/minio:latest server /data{1...4})
	@(env bash $(PWD)/portal-ui/tests/scripts/initialize-env.sh)

cleanup-permissions:
	@(env bash $(PWD)/portal-ui/tests/scripts/cleanup-env.sh)
	@(docker stop minio)

test:
	@(GO111MODULE=on go test -race -v github.com/minio/console/restapi/...)

test-pkg:
	@(GO111MODULE=on go test -race -v github.com/minio/console/pkg/...)

coverage:
	@(GO111MODULE=on go test -v -coverprofile=coverage.out github.com/minio/console/restapi/... && go tool cover -html=coverage.out && open coverage.html)

clean:
	@echo "Cleaning up all the generated files"
	@find . -name '*.test' | xargs rm -fv
	@find . -name '*~' | xargs rm -fv
	@rm -vf console

docker:
	@docker buildx build --output=type=docker --platform linux/amd64 -t $(TAG) --build-arg build_version=$(BUILD_VERSION) --build-arg build_time='$(BUILD_TIME)' .
