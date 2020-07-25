#!/bin/bash
# Get's the latest deployment file from MinIO Operator
curl https://raw.githubusercontent.com/minio/operator/master/minio-operator.yaml > operator-console/base/minio-operator.yaml
