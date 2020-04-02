default: mcs

.PHONY: mcs
mcs:
	@echo "Building mcs binary to './mcs'"
	@(cd cmd/mcs-server; CGO_ENABLED=0 go build --ldflags "-s -w" -o ../../mcs-server)
	
swagger-gen:
	@echo "Generating swagger server code from yaml"
	@swagger generate server -A mcs -f ./swagger.yml -r minio_copyright.txt

build:
	@(cd portal-ui; yarn install; make build; cd ..)
	@(cd cmd/mcs-server; CGO_ENABLED=0 go build --ldflags "-s -w" -o ../../mcs-server)	
