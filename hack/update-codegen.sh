#!/bin/bash
#
# Copyright 2020 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set -o errexit
set -o nounset
set -o pipefail

SCRIPT_ROOT=$(dirname ${BASH_SOURCE})/..

go get -d k8s.io/code-generator/...

# Checkout code-generator to compatible version
#(cd $GOPATH/src/k8s.io/code-generator && git checkout origin/release-1.14 -B release-1.14)

REPOSITORY=github.com/minio/console
$GOPATH/src/k8s.io/code-generator/generate-groups.sh all \
  $REPOSITORY/pkg/clientgen $REPOSITORY/pkg/apis networking.gke.io:v1beta2 \
  --go-header-file $SCRIPT_ROOT/hack/header.go.txt
