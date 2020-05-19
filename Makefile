PWD := $(shell pwd)
GOPATH := $(shell go env GOPATH)

default: mcs

.PHONY: mcs
mcs:
	@echo "Building mcs binary to './mcs'"
	@(GO111MODULE=on CGO_ENABLED=0 go build -trimpath --tags=kqueue --ldflags "-s -w" -o mcs ./cmd/mcs)

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

install: mcs
	@echo "Installing mcs binary to '$(GOPATH)/bin/mcs'"
	@mkdir -p $(GOPATH)/bin && cp -f $(PWD)/mcs $(GOPATH)/bin/mcs
	@echo "Installation successful. To learn more, try \"mcs --help\"."

swagger-gen:
	@echo "Generating swagger server code from yaml"
	@swagger generate server -A mcs --main-package=mcs --exclude-main -P models.Principal -f ./swagger.yml -r NOTICE

assets:
	@(cd portal-ui; yarn install; make build-static; cd ..)

test:
	@(GO111MODULE=on go test -race -v github.com/minio/mcs/restapi/...)
	@(GO111MODULE=on go test -race -v github.com/minio/mcs/pkg/...)

coverage:
	@(GO111MODULE=on go test -v -coverprofile=coverage.out github.com/minio/mcs/restapi/... && go tool cover -html=coverage.out && open coverage.html)

clean:
	@echo "Cleaning up all the generated files"
	@find . -name '*.test' | xargs rm -fv
	@find . -name '*~' | xargs rm -fv
	@rm -vf mcs
