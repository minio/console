
## Console Docker Compose

This compose file allows users to quickly deploy MinIO Console, LogSearch & Prometheus in a baremetal (non Kubernetes) environment.

### Pre-requisites

1. [MinIO](https://docs.minio.io/docs/distributed-minio-quickstart-guide.html) cluster up and running.
2. [mc](https://docs.minio.io/docs/minio-client-quickstart-guide.html) configured for this MinIO cluster.
3. [Docker-Compose](https://docs.docker.com/compose/) installed on the server.

### Getting Started

- Download the contents of `compose` directory on your machine.

- Edit the `prometheus.yaml` file and fill in the correct target (MinIO Endpoint). Optionally setup the `bearer_token` as explained [here](https://github.com/minio/minio/tree/master/docs/metrics/prometheus#31-authenticated-prometheus-config).

- Setup a console admin policy.

```sh
cat > admin.json << EOF
{
	"Version": "2012-10-17",
	"Statement": [{
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
```

Then create this policy on MinIO server: `mc admin policy add myminio consoleAdmin admin.json`.

- Setup user and policy for Console

```
mc admin user add myminio console console123
mc admin policy set myminio consoleAdmin user=console
```

- Configure Webhook target on the MinIO server. Remember to change the `token` value in below URL to the actual token value as set in the `.env` file.

```
mc admin config set myminio audit_webhook:1 endpoint=http://localhost:8080/api/ingest?token=c6rkqjZ03ElEUKQ7MtSeYBJ8q_p3GDFPBQAQJlcbBLA=
mc admin service restart myminio
```

### Configuration

To configure the Console Compose file to custom setup, please take a look at the [`.env`](./.env) file.
