module github.com/minio/console

go 1.15

require (
	github.com/coreos/go-oidc v2.2.1+incompatible
	github.com/elazarl/go-bindata-assetfs v1.0.0
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
	github.com/minio/mc v0.0.0-20201220181029-41c804b179de
	github.com/minio/minio v0.0.0-20201221162327-6df6ac0f3410
	github.com/minio/minio-go/v7 v7.0.7-0.20201217170524-3baf9ea06f7c
	github.com/minio/operator v0.0.0-20201204220226-9901d1d0766c
	github.com/minio/operator/logsearchapi v0.0.0-20201217190212-bf6546b09012
	github.com/mitchellh/go-homedir v1.1.0
	github.com/pquerna/cachecontrol v0.0.0-20180517163645-1555304b9b35 // indirect
	github.com/secure-io/sio-go v0.3.1
	github.com/stretchr/testify v1.6.1
	github.com/unrolled/secure v1.0.7
	golang.org/x/crypto v0.0.0-20201124201722-c8d3bf9c5392
	golang.org/x/net v0.0.0-20201010224723-4f7140c49acb
	golang.org/x/oauth2 v0.0.0-20200107190931-bf48bf16ab8d
	gopkg.in/yaml.v2 v2.3.0
	k8s.io/api v0.18.6
	k8s.io/apimachinery v0.18.8
	k8s.io/client-go v0.18.6
)

replace github.com/minio/operator v0.0.0-20201204220226-9901d1d0766c => github.com/dvaldivia/operator v0.0.0-20201230052356-04efc0ea5890
