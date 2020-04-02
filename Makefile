default: mcs

.PHONY: mcs
mcs:
	@echo "Building mcs binary to './mcs'"
	@(CGO_ENABLED=0 go build --tags kqueue --ldflags "-s -w" -o mcs ./cmd/mcs-server)

swagger-gen:
	@echo "Generating swagger server code from yaml"
	@swagger generate server -A mcs -f ./swagger.yml -r minio_copyright.txt

build:
	@(cd portal-ui; yarn install; make build; cd ..)
	@(CGO_ENABLED=0 go build --tags kqueue --ldflags "-s -w" -o mcs ./cmd/mcs-server)

clean:
	@rm -vf mcs
