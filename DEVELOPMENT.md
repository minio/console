# Development

This is a REST portal server created using [go-swagger](https://github.com/go-swagger/go-swagger)

The API handlers are created using a YAML definition located in `swagger.YAML`.

To add new api, the YAML file needs to be updated with all the desired apis using the [Swagger Basic Structure](https://swagger.io/docs/specification/2-0/basic-structure/), this includes paths, parameters, definitions, tags, etc.

## Generate server from YAML 
Once the YAML file is ready we can autogenerate the code needed for the new api by just running:

Validate it:
```
swagger validate ./swagger.yml
```
Update server code:
```
make swagger-gen
```

This will update all the necessary code.

`./restapi/configure_mcs.go` is a file that contains the handlers to be used by the application, here is the only place where we need to update our code to support the new apis. This file is not affected when running the swagger generator and it is safe to edit.

## Unit Tests
`./restapi/handlers_test.go` needs to be updated with the proper tests for the new api.

To run tests:
```
go test ./restapi
```
