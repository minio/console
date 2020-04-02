# MCS Minio Console Service

This is a REST portal server created using [go-swagger](https://github.com/go-swagger/go-swagger)

## Setup

All `mcs` needs is a MinIO user with admin privileges and URL pointing to your MinIO deployment.
> Note: We don't recommend using MinIO's Operator Credentials

1. Create a user for `mcs` using `mc`. 
```
$ set +o history
$ mc admin user add myminio mcs YOURMCSSECRET
$ set -o history
```

2. Create a policy for `mcs`

```
$ cat > mcsAdmin.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "admin:*"
      ],
      "Effect": "Allow",
      "Sid": ""
    },
    {
      "Action": [
        "s3:*"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::*"
      ],
      "Sid": ""
    }
  ]
}
EOF
$ mc admin policy add myminio mcsAdmin mcsAdmin.json
```

3. Set the policy for the new `mcs` user

```
$ mc admin policy set myminio mcsAdmin user=mcs
```

## Run MCS server
To run the server:

```
$ MCS_ACCESS_KEY=mcs \
MCS_SECRET_KEY=YOURMCSSECRET \
MCS_MINIO_SERVER=http://localhost:9000 \
./mcs-server --port=52300
```
You can verify that the apis work by doing the request on `localhost:52300/api/v1/...`

# Development

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
