module github.com/minio/console

go 1.16

require (
	github.com/blang/semver/v4 v4.0.0
	github.com/cheggaaa/pb/v3 v3.0.6
	github.com/dustin/go-humanize v1.0.0
	github.com/go-openapi/errors v0.19.9
	github.com/go-openapi/loads v0.20.2
	github.com/go-openapi/runtime v0.19.24
	github.com/go-openapi/spec v0.20.3
	github.com/go-openapi/strfmt v0.20.0
	github.com/go-openapi/swag v0.19.14
	github.com/go-openapi/validate v0.20.2
	github.com/gorilla/websocket v1.4.2
	github.com/jessevdk/go-flags v1.4.0
	github.com/klauspost/compress v1.13.6
	github.com/minio/cli v1.22.0
	github.com/minio/direct-csi v1.3.5-0.20210601185811-f7776f7961bf
	github.com/minio/kes v0.11.0
	github.com/minio/madmin-go v1.1.10
	github.com/minio/mc v0.0.0-20211027024940-7866f97ef502
	github.com/minio/minio-go/v7 v7.0.15-0.20211004160302-3b57c1e369ca
	github.com/minio/operator v0.0.0-20211011212245-31460bbbc4b7
	github.com/minio/operator/logsearchapi v0.0.0-20211011212245-31460bbbc4b7
	github.com/minio/pkg v1.1.5
	github.com/minio/selfupdate v0.3.1
	github.com/mitchellh/go-homedir v1.1.0
	github.com/rs/xid v1.3.0
	github.com/secure-io/sio-go v0.3.1
	github.com/stretchr/testify v1.7.0
	github.com/unrolled/secure v1.0.9
	golang.org/x/crypto v0.0.0-20210921155107-089bfa567519
	golang.org/x/net v0.0.0-20210928044308-7d9f5e0b762b
	golang.org/x/oauth2 v0.0.0-20210514164344-f6687ab2804c
	gopkg.in/yaml.v2 v2.4.0
	k8s.io/api v0.21.1
	k8s.io/apimachinery v0.21.1
	k8s.io/client-go v0.21.1
)

replace google.golang.org/grpc => google.golang.org/grpc v1.29.1
