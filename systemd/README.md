# Systemd service for MinIO Console

Systemd script for MinIO Console.

## Installation

- Systemd script is configured to run the binary from /usr/local/bin/.
- Systemd script is configured to run the binary as `console-user`, make sure you create this user prior using service script.
- Download the binary. Find the relevant links for the binary https://github.com/minio/console#binary-releases.

## Create the Environment configuration file

This file serves as input to MinIO Console systemd service.

```sh
$ cat <<EOT >> /etc/default/minio-console
# Special opts
CONSOLE_OPTS="--port 8443"

# salt to encrypt JWT payload
CONSOLE_PBKDF_PASSPHRASE=CHANGEME

# required to encrypt JWT payload
CONSOLE_PBKDF_SALT=CHANGEME

# MinIO Endpoint
CONSOLE_MINIO_SERVER=http://minio.endpoint:9000

EOT
```

## Systemctl

Download `minio-console.service` in  `/etc/systemd/system/`

```
( cd /etc/systemd/system/; curl -O https://raw.githubusercontent.com/minio/console/master/systemd/minio-console.service )
```

Enable startup on boot

```
systemctl enable minio-console.service
```

## Note

- Replace ``User=console-user`` and ``Group=console-user`` in minio-console.service file with your local setup.
- Ensure that ``CONSOLE_PBKDF_PASSPHRASE`` and ``CONSOLE_PBKDF_SALT`` are set to appropriate values.
- Ensure that ``CONSOLE_MINIO_SERVER`` is set to appropriate server endpoint.
