# MCS service account authentication with Mkube

`MCS` will authenticate against `Mkube`using bearer tokens via HTTP `Authorization` header. The user will provide this token once
in the login form, MCS will validate it against Mkube (list tenants) and if valid will generate and return a new MCS sessions 
with encrypted claims (the user Service account token will be inside the JWT in the data field)

# Kubernetes

The provided `JWT token` corresponds to the `Kubernetes service account` that `Mkube` will use to run tasks on behalf of the
user, ie: list, create, edit, delete tenants, storage class, etc.

# Development

If you are running mcs in your local environment and wish to make request to `Mkube` you can set `MCS_M3_HOSTNAME`, if
the environment variable is not present by default `MCS` will use `"http://m3:8787"`, additionally you will need to set the
`MCS_MKUBE_ADMIN_ONLY=on` variable to make MCS display the Mkube UI 

## Extract the Service account token and use it with MCS

For local development you can use the jwt associated to the `m3-sa` service account, you can get the token running
the following command in your terminal:

```
kubectl get secret $(kubectl get serviceaccount m3-sa -o jsonpath="{.secrets[0].name}") -o jsonpath="{.data.token}" | base64 --decode
```

Then run the mcs server

```
MCS_M3_HOSTNAME=http://localhost:8787 MCS_MKUBE_ADMIN_ONLY=on ./mcs server
```

# Self-signed certificates and Custom certificate authority for Mkube

If Mkube uses TLS with a self-signed certificate, or a certificate issued by a custom certificate authority you can add those
certificates usinng the `MCS_M3_SERVER_TLS_CA_CERTIFICATE` env variable

````
MCS_M3_SERVER_TLS_CA_CERTIFICATE=cert1.pem,cert2.pem,cert3.pem ./mcs server
````