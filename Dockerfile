FROM golang:1.15 as binlayer

RUN go get github.com/go-bindata/go-bindata/... && go get github.com/elazarl/go-bindata-assetfs/...

FROM node:10 as uilayer

WORKDIR /app

COPY --from=binlayer /go/bin/go-bindata-assetfs /bin/
COPY --from=binlayer /go/bin/go-bindata /bin/

COPY ./portal-ui/package.json ./
COPY ./portal-ui/yarn.lock ./
RUN yarn install

COPY ./portal-ui .

RUN yarn install && make build-static

USER node

FROM golang:1.15 as golayer

RUN apt-get update -y && apt-get install -y ca-certificates

ADD go.mod /go/src/github.com/minio/console/go.mod
ADD go.sum /go/src/github.com/minio/console/go.sum
WORKDIR /go/src/github.com/minio/console/

# Get dependencies - will also be cached if we won't change mod/sum
RUN go mod download

ADD . /go/src/github.com/minio/console/
WORKDIR /go/src/github.com/minio/console/

COPY --from=uilayer /app/bindata_assetfs.go /go/src/github.com/minio/console/portal-ui/

ENV CGO_ENABLED=0

RUN go build -ldflags "-w -s" -a -o console ./cmd/console

FROM scratch
MAINTAINER MinIO Development "dev@min.io"
EXPOSE 9090

COPY --from=golayer /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=golayer /go/src/github.com/minio/console/console .

ENTRYPOINT ["/console"]
