FROM golang:1.13

RUN apt-get update -y && apt-get install -y ca-certificates

ADD go.mod /go/src/github.com/minio/console/go.mod
ADD go.sum /go/src/github.com/minio/console/go.sum
WORKDIR /go/src/github.com/minio/console/

# Get dependencies - will also be cached if we won't change mod/sum
RUN go mod download

ADD . /go/src/github.com/minio/console/
WORKDIR /go/src/github.com/minio/console/

ENV CGO_ENABLED=0

RUN go build -ldflags "-w -s" -a -o console ./cmd/console

FROM scratch
MAINTAINER MinIO Development "dev@min.io"
EXPOSE 9090

COPY --from=0 /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=0 /go/src/github.com/minio/console/console .

CMD ["/console"]
