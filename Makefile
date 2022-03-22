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
	@(GO111MODULE=on CGO_ENABLED=0 go build -trimpath --tags=kqueue,operator --ldflags "-s -w" -o console ./cmd/console)

k8sdev:
	@docker build -t $(TAG) --build-arg build_version=$(BUILD_VERSION) --build-arg build_time='$(BUILD_TIME)' .
	@kind load docker-image $(TAG)
	@echo "Done, now restart your console deployment"

getdeps:
	@mkdir -p ${GOPATH}/bin
	@which golangci-lint 1>/dev/null || (echo "Installing golangci-lint" && curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(GOPATH)/bin v1.43.0)

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
	@(cd portal-ui; yarn install --prefer-offline; make build-static; yarn prettier --write . --loglevel warn; cd ..)

test-integration:
	@(docker stop pgsqlcontainer || true)
	@(docker stop minio || true)
	@(docker network rm mynet123 || true)
	@echo "create docker network to communicate containers MinIO & PostgreSQL"
	@(docker network create --subnet=173.18.0.0/29 mynet123)
	@echo "docker run with MinIO Version below:"
	@echo $(MINIO_VERSION)
	@(docker run -v /data1 -v /data2 -v /data3 -v /data4 --net=mynet123 -d --name minio --rm -p 9000:9000 -p 9001:9001 -e MINIO_KMS_SECRET_KEY=my-minio-key:OSMM+vkKUTCvQs9YL/CVMIMt43HFhkUpqJxTmGl6rYw= $(MINIO_VERSION) server /data{1...4} --console-address ':9001' && sleep 5)
	@(docker run --net=mynet123 --ip=173.18.0.3 --name pgsqlcontainer --rm -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres && sleep 5)
	@echo "execute test and get coverage"
	@(cd integration && go test -coverpkg=../restapi -c -tags testrunmain . && mkdir -p coverage && ./integration.test -test.v -test.run "^Test*" -test.coverprofile=coverage/system.out)
	@(docker stop pgsqlcontainer)
	@(docker stop minio)
	@(docker network rm mynet123)

test-operator-integration:
	@(echo "Start cd operator-integration && go test:")
	@(pwd)
	@(cd operator-integration && go test -coverpkg=../restapi -c -tags testrunmain . && mkdir -p coverage && ./operator-integration.test -test.v -test.run "^Test*" -test.coverprofile=coverage/operator-api.out)

test-operator:
	@(env bash $(PWD)/portal-ui/tests/scripts/operator.sh)
	@(docker stop minio)

test-permissions:
	@(docker run -v /data1 -v /data2 -v /data3 -v /data4 -d --name minio --rm -p 9000:9000 quay.io/minio/minio:latest server /data{1...4})
	@(env bash $(PWD)/portal-ui/tests/scripts/permissions.sh)
	@(docker stop minio)

test-apply-permissions:
	@(env bash $(PWD)/portal-ui/tests/scripts/initialize-env.sh)

test-start-docker-minio:
	@(docker run -v /data1 -v /data2 -v /data3 -v /data4 -d --name minio --rm -p 9000:9000 quay.io/minio/minio:latest server /data{1...4})

initialize-operator:
	@echo "Done initializing operator test"

initialize-permissions: test-start-docker-minio test-apply-permissions
	@echo "Done initializing permissions test"

cleanup-permissions:
	@(env bash $(PWD)/portal-ui/tests/scripts/cleanup-env.sh)
	@(docker stop minio)

test:
	@echo "execute test and get coverage"
	@(cd restapi && mkdir coverage && GO111MODULE=on go test -test.v -coverprofile=coverage/coverage.out)

test-pkg:
	@echo "execute test and get coverage"
	@(cd pkg && mkdir coverage && GO111MODULE=on go test -test.v -coverprofile=coverage/coverage-pkg.out)

coverage:
	@(GO111MODULE=on go test -v -coverprofile=coverage.out github.com/minio/console/restapi/... && go tool cover -html=coverage.out && open coverage.html)

clean:
	@echo "Cleaning up all the generated files"
	@find . -name '*.test' | xargs rm -fv
	@find . -name '*~' | xargs rm -fv
	@rm -vf console

docker:
	@docker buildx build --output=type=docker --platform linux/amd64 -t $(TAG) --build-arg build_version=$(BUILD_VERSION) --build-arg build_time='$(BUILD_TIME)' .

release: swagger-gen
	@echo "Generating Release: $(RELEASE)"
	@make assets
	@yq -i e '.spec.template.spec.containers[0].image |= "minio/console:$(RELEASE)"' k8s/operator-console/base/console-deployment.yaml
	@yq -i e 'select(.kind == "Deployment").spec.template.spec.containers[0].image |= "minio/console:$(RELEASE)"' k8s/operator-console/standalone/console-deployment.yaml
	@git add -u .
	@git add portal-ui/build/
