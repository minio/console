module github.com/minio/console

go 1.16

require (
	github.com/blang/semver/v4 v4.0.0
	github.com/cheggaaa/pb/v3 v3.0.6
	github.com/coreos/go-oidc v2.2.1+incompatible
	github.com/go-openapi/errors v0.19.6
	github.com/go-openapi/loads v0.19.5
	github.com/go-openapi/runtime v0.19.19
	github.com/go-openapi/spec v0.19.8
	github.com/go-openapi/strfmt v0.19.5
	github.com/go-openapi/swag v0.19.9
	github.com/go-openapi/validate v0.19.10
	github.com/gorilla/websocket v1.4.2
	github.com/jessevdk/go-flags v1.4.0
	github.com/minio/cli v1.22.0
	github.com/minio/kes v0.11.0
	github.com/minio/mc v0.0.0-20210301162250-f9d36f9b5243
	github.com/minio/minio v0.0.0-20210301203133-e8d8dfa3ae8f
	github.com/minio/minio-go/v7 v7.0.10
	github.com/minio/operator v0.0.0-20210201110528-753019b838b4
	github.com/minio/operator/logsearchapi v0.0.0-20210201110528-753019b838b4
	github.com/minio/selfupdate v0.3.1
	github.com/mitchellh/go-homedir v1.1.0
	github.com/pquerna/cachecontrol v0.0.0-20180517163645-1555304b9b35 // indirect
	github.com/rs/xid v1.2.1
	github.com/secure-io/sio-go v0.3.1
	github.com/stretchr/testify v1.6.1
	github.com/unrolled/secure v1.0.7
	golang.org/x/crypto v0.0.0-20201124201722-c8d3bf9c5392
	golang.org/x/net v0.0.0-20201224014010-6772e930b67b
	golang.org/x/oauth2 v0.0.0-20200107190931-bf48bf16ab8d
	gopkg.in/yaml.v2 v2.3.0
	k8s.io/api v0.20.2
	k8s.io/apimachinery v0.20.2
	k8s.io/client-go v0.20.2
)

replace (
	github.com/minio/mc v0.0.0-20210301162250-f9d36f9b5243 => github.com/krisis/mc v0.0.0-20210212174421-7b633602cb9b
	github.com/minio/minio v0.0.0-20210301203133-e8d8dfa3ae8f => github.com/poornas/minio v0.0.0-20210222213933-192ae7d4df2c
)
