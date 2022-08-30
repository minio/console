#!/bin/bash

# Expanding gofmt to cover more areas.
# This will include auto generated files created by Swagger.
# Catching the difference due to https://github.com/golang/go/issues/46289
DIFF=$(GO111MODULE=on gofmt -d .)
if [[ -n $DIFF ]];
then
	echo "$DIFF";
	echo "please run gofmt";
	exit 1;
fi
