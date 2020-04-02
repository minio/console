default: mcs

.PHONY: mcs
mcs:
	@echo "Building mcs binary to './mcs'"
	@(CGO_ENABLED=0 go build --tags kqueue --ldflags "-s -w" -o mcs ./cmd/mcs)

swagger-gen:
	@echo "Generating swagger server code from yaml"
	@swagger generate server -A mcs --main-package=mcs --exclude-main -P models.Principal -f ./swagger.yml -r NOTICE

build:
	@(cd portal-ui; yarn install; make build; cd ..)
	@(CGO_ENABLED=0 go build --tags kqueue --ldflags "-s -w" -o mcs ./cmd/mcs)

test:
	@(go test ./restapi -v)

coverage:
	@(go test ./restapi -v -coverprofile=coverage.out && go tool cover -html=coverage.out && open coverage.html)

clean:
	@rm -vf mcs
