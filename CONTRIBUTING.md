# MinIO Console Server Contribution Guide [![Slack](https://slack.min.io/slack?type=svg)](https://slack.min.io)

This is a REST portal server created using [go-swagger](https://github.com/go-swagger/go-swagger)

The API handlers are created using a YAML definition located in `swagger.YAML`.

To add new api, the YAML file needs to be updated with all the desired apis using
the [Swagger Basic Structure](https://swagger.io/docs/specification/2-0/basic-structure/), this includes paths,
parameters, definitions, tags, etc.

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

`./api/configure_console.go` is a file that contains the handlers to be used by the application, here is the only place
where we need to update our code to support the new apis. This file is not affected when running the swagger generator
and it is safe to edit.

## Unit Tests

`./api/handlers_test.go` needs to be updated with the proper tests for the new api.

To run tests:

```
go test ./api
```

## Commit changes

After verification, commit your changes. This is a [great post](https://chris.beams.io/posts/git-commit/) on how to
write useful commit messages

```
$ git commit -am 'Add some feature'
```

### Push to the branch

Push your locally committed changes to the remote origin (your fork)

```
$ git push origin my-new-feature
```

### Create a Pull Request

Pull requests can be created via GitHub. Refer
to [this document](https://help.github.com/articles/creating-a-pull-request/) for detailed steps on how to create a pull
request. After a Pull Request gets peer reviewed and approved, it will be merged.

## FAQs

### How does ``console`` manages dependencies?

``MinIO`` uses `go mod` to manage its dependencies.

- Run `go get foo/bar` in the source folder to add the dependency to `go.mod` file.

To remove a dependency

- Edit your code and remove the import reference.
- Run `go mod tidy` in the source folder to remove dependency from `go.mod` file.

### What are the coding guidelines for console?

``console`` is fully conformant with Golang style.
Refer: [Effective Go](https://github.com/golang/go/wiki/CodeReviewComments) article from Golang project. If you observe
offending code, please feel free to send a pull request or ping us on [Slack](https://slack.min.io).
