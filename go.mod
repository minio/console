module github.com/minio/console

go 1.16

require (
	github.com/blang/semver/v4 v4.0.0
	github.com/cheggaaa/pb/v3 v3.0.6
	github.com/coreos/go-oidc v2.2.1+incompatible
	github.com/go-openapi/errors v0.19.9
	github.com/go-openapi/loads v0.20.2
	github.com/go-openapi/runtime v0.19.24
	github.com/go-openapi/spec v0.20.3
	github.com/go-openapi/strfmt v0.20.0
	github.com/go-openapi/swag v0.19.14
	github.com/go-openapi/validate v0.20.2
	github.com/gorilla/websocket v1.4.2
	github.com/jessevdk/go-flags v1.4.0
	github.com/minio/cli v1.22.0
	github.com/minio/direct-csi v1.3.5-0.20210601185811-f7776f7961bf
	github.com/minio/kes v0.11.0
	github.com/minio/madmin-go v1.0.12
	github.com/minio/mc v0.0.0-20210531030240-fbbae711bdb4
	github.com/minio/minio-go/v7 v7.0.12-0.20210617160455-b7103728fb87
	github.com/minio/operator v0.0.0-20210616045941-65f31f5f78ae
	github.com/minio/operator/logsearchapi v0.0.0-20210604224119-7e256f98cf90
	github.com/minio/pkg v1.0.6
	github.com/minio/selfupdate v0.3.1
	github.com/mitchellh/go-homedir v1.1.0
	github.com/pquerna/cachecontrol v0.0.0-20180517163645-1555304b9b35 // indirect
	github.com/rs/xid v1.2.1
	github.com/secure-io/sio-go v0.3.1
	github.com/stretchr/testify v1.7.0
	github.com/unrolled/secure v1.0.7
	golang.org/x/crypto v0.0.0-20210421170649-83a5a9bb288b
	golang.org/x/net v0.0.0-20210421230115-4e50805a0758
	golang.org/x/oauth2 v0.0.0-20200107190931-bf48bf16ab8d
	gopkg.in/yaml.v2 v2.4.0
	k8s.io/api v0.21.1
	k8s.io/apimachinery v0.21.1
	k8s.io/client-go v0.21.1
)

replace google.golang.org/grpc => google.golang.org/grpc v1.29.1
