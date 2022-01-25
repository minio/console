#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

SCRIPT_ROOT=$(dirname ${BASH_SOURCE})/..

GO111MODULE=off go get -d k8s.io/code-generator/...

REPOSITORY=github.com/minio/console
$GOPATH/src/k8s.io/code-generator/generate-groups.sh all \
  $REPOSITORY/pkg/clientgen $REPOSITORY/pkg/apis networking.gke.io:v1beta2 \
  --go-header-file $SCRIPT_ROOT/hack/header.go.txt
