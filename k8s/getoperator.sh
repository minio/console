#!/bin/bash
# Get's the latest deployment file from MinIO Operator
curl https://raw.githubusercontent.com/minio/minio-operator/master/minio-operator.yaml > base/minio-operator.yaml
