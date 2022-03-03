#!/bin/bash

echo "create the 3 folders, one per needed repository dependencies"
mkdir console
mkdir minio
mkdir mc

echo "create dummy file for each module to get the dependencies"
echo "package main" > hello.go
echo "import \"fmt\"" >> hello.go
echo "func main() {" >> hello.go
echo "    fmt.Println(\"Hello, World!\")" >> hello.go
echo "}" >> hello.go

echo "go and get the go.mod file for each repo"
cd console
wget https://raw.githubusercontent.com/minio/console/master/go.mod
cp ../hello.go hello.go
go get
cd ../minio
wget https://raw.githubusercontent.com/minio/minio/master/go.mod
cp ../hello.go hello.go
go get
cd ../mc
wget https://raw.githubusercontent.com/minio/mc/master/go.mod
cp ../hello.go hello.go
go get
cd ..
