# Minio Console Server

A graphical user interface for [MinIO](https://github.com/minio/minio)

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
export MCS_ACCESS_KEY=mcs
export MCS_SECRET_KEY=YOURMCSSECRET
export MCS_MINIO_SERVER=http://localhost:9000
./mcs server
```

You can verify that the apis work by doing the request on `localhost:9090/api/v1/...`

# Contribute to mcs Project
Please follow mcs [Contributor's Guide](https://github.com/minio/mcs/blob/master/CONTRIBUTING.md)
