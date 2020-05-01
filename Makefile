PWD := $(shell pwd)
GOPATH := $(shell go env GOPATH)

default: mcs

.PHONY: mcs
mcs:
	@echo "Building mcs binary to './mcs'"
	@(CGO_ENABLED=0 go build -trimpath --tags=kqueue --ldflags "-s -w" -o mcs ./cmd/mcs)

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
	@(go test -race -v github.com/minio/mcs/restapi/...)
	@(go test -race -v github.com/minio/mcs/pkg/auth/...)

coverage:
	@(go test -v -coverprofile=coverage.out github.com/minio/mcs/restapi/... && go tool cover -html=coverage.out && open coverage.html)

clean:
	@echo "Cleaning up all the generated files"
	@find . -name '*.test' | xargs rm -fv
	@find . -name '*~' | xargs rm -fv
	@rm -vf mcs
