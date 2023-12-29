# Developing MinIO Console

The MinIO Console requires the [MinIO Server](https://github.com/minio/minio). For development purposes, you also need
to run both the MinIO Console web app and the MinIO Console server.

## Running MinIO Console server

Build the server in the main folder by running:

```
make
```

> Note: If it's the first time running the server, you might need to run `go mod tidy` to ensure you have all modules
> required.
> To start the server run:

```
CONSOLE_ACCESS_KEY=<your-access-key>
CONSOLE_SECRET_KEY=<your-secret-key>
CONSOLE_MINIO_SERVER=<minio-server-endpoint>
CONSOLE_DEV_MODE=on
./console server
```

## Running MinIO Console web app

Refer to `/web-app` [instructions](/web-app/README.md) to run the web app locally.

# Building with MinIO

To test console in its shipping format, you need to build it from the MinIO repository, the following step will guide
you to do that.

### 0. Building with UI Changes

If you are performing changes in the UI components of console and want to test inside the MinIO binary, you need to
build assets first.

In the console folder run

```shell
make assets
```

This will regenerate all the static assets that will be served by MinIO.

### 1. Clone the `MinIO` repository

In the parent folder of where you cloned this `console` repository, clone the MinIO Repository

```shell
git clone https://github.com/minio/minio.git
```

### 2. Update `go.mod` to use your local version

In the MinIO repository open `go.mod` and after the first `require()` directive add a `replace()` directive

```
...
)

replace (
github.com/minio/console => "../console"
)

require (
...
```

### 3. Build `MinIO`

Still in the MinIO folder, run

```shell
make build
```

# Testing on Kubernetes

If you want to test console on kubernetes, you can perform all the steps from `Building with MinIO`, but change `Step 3`
to the following:

```shell
TAG=miniodev/console:dev make docker
```

This will build a docker container image that can be used to test with your local kubernetes environment.

For example, if you are using kind:

```shell
kind load docker-image miniodev/console:dev
```

and then deploy any `Tenant` that uses this image

# LDAP authentication with Console

## Setup

Run openLDAP with docker.

```
$ docker run --rm -p 389:389 -p 636:636 --name my-openldap-container --detach osixia/openldap:1.3.0
```

Run the `billy.ldif` file using `ldapadd` command to create a new user and assign it to a group.

```
$ docker cp console/docs/ldap/billy.ldif my-openldap-container:/container/service/slapd/assets/test/billy.ldif
$ docker exec my-openldap-container ldapadd -x -D "cn=admin,dc=example,dc=org" -w admin -f /container/service/slapd/assets/test/billy.ldif -H ldap://localhost
```

Query the ldap server to check the user billy was created correctly and got assigned to the consoleAdmin group, you
should get a list
containing ldap users and groups.

```
$ docker exec my-openldap-container ldapsearch -x -H ldap://localhost -b dc=example,dc=org -D "cn=admin,dc=example,dc=org" -w admin
```

Query the ldap server again, this time filtering only for the user `billy`, you should see only 1 record.

```
$ docker exec my-openldap-container ldapsearch -x -H ldap://localhost -b uid=billy,dc=example,dc=org -D "cn=admin,dc=example,dc=org" -w admin
```

### Change the password for user billy

Set the new password for `billy` to `minio123` and enter `admin` as the default `LDAP Password`

```
$ docker exec -it my-openldap-container /bin/bash
# ldappasswd -H ldap://localhost -x -D "cn=admin,dc=example,dc=org" -W -S "uid=billy,dc=example,dc=org"
New password:
Re-enter new password:
Enter LDAP Password:
```

### Add the consoleAdmin policy to user billy on MinIO

```
$ cat > consoleAdmin.json << EOF
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
$ mc admin policy create myminio consoleAdmin consoleAdmin.json
$ mc admin policy attach myminio consoleAdmin --user="uid=billy,dc=example,dc=org"
```

## Run MinIO

```
export MINIO_ACCESS_KEY=minio
export MINIO_SECRET_KEY=minio123
export MINIO_IDENTITY_LDAP_SERVER_ADDR='localhost:389'
export MINIO_IDENTITY_LDAP_USERNAME_FORMAT='uid=%s,dc=example,dc=org'
export MINIO_IDENTITY_LDAP_USERNAME_SEARCH_FILTER='(|(objectclass=posixAccount)(uid=%s))'
export MINIO_IDENTITY_LDAP_TLS_SKIP_VERIFY=on
export MINIO_IDENTITY_LDAP_SERVER_INSECURE=on
./minio server ~/Data
```

## Run Console

```
export CONSOLE_LDAP_ENABLED=on
./console server
```
