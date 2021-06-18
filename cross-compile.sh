#!/bin/bash

set -e
# Enable tracing if set.
[ -n "$BASH_XTRACEFD" ] && set -x

## All binaries are static make sure to disable CGO.
export CGO_ENABLED=0

## List of architectures and OS to test cross compilation.
SUPPORTED_OSARCH_DEFAULTS="linux/ppc64le linux/mips64 linux/arm64 linux/s390x darwin/amd64 freebsd/amd64 windows/amd64 linux/arm linux/386 netbsd/amd64"
SUPPORTED_OSARCH=${1:-$SUPPORTED_OSARCH_DEFAULTS}

_build() {
    local osarch=$1
    IFS=/ read -r -a arr <<<"$osarch"
    os="${arr[0]}"
    arch="${arr[1]}"
    package=$(go list -f '{{.ImportPath}}' ./cmd/console)
    printf -- "--> %15s:%s\n" "${osarch}" "${package}"

    # go build -trimpath to build the binary.
    GOOS=$os GOARCH=$arch GO111MODULE=on go build -trimpath --tags=kqueue --ldflags "-s -w" -o /dev/null ./cmd/console
}

main() {
    echo "Testing builds for OS/Arch: ${SUPPORTED_OSARCH}"
    for each_osarch in ${SUPPORTED_OSARCH}; do
        _build "${each_osarch}"
    done
}

main "$@"
