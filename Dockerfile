FROM golang:1.13

RUN apt-get update -y && apt-get install -y ca-certificates

ADD go.mod /go/src/github.com/minio/mcs/go.mod
ADD go.sum /go/src/github.com/minio/mcs/go.sum
WORKDIR /go/src/github.com/minio/mcs/

# Get dependencies - will also be cached if we won't change mod/sum
RUN go mod download

ADD . /go/src/github.com/minio/mcs/
WORKDIR /go/src/github.com/minio/mcs/

ENV CGO_ENABLED=0

RUN go build -ldflags "-w -s" -a -o mcs ./cmd/mcs

FROM scratch
MAINTAINER MinIO Development "dev@min.io"
EXPOSE 9090

COPY --from=0 /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=0 /go/src/github.com/minio/mcs/mcs .

CMD ["/mcs"]
