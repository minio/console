# Running MCS in Operator mode

`MCS` will authenticate against `Kubernetes`using bearer tokens via HTTP `Authorization` header. The user will provide this token once
in the login form, MCS will validate it against Kubernetes (list apis) and if valid will generate and return a new MCS sessions 
with encrypted claims (the user Service account token will be inside the JWT in the data field)

# Kubernetes

The provided `JWT token` corresponds to the `Kubernetes service account` that `MCS` will use to run tasks on behalf of the
user, ie: list, create, edit, delete tenants, storage class, etc.


# Development

If console is running inside a k8s pod `KUBERNETES_SERVICE_HOST` and `KUBERNETES_SERVICE_PORT` will contain the k8s api server apiServerAddress
if console is not running inside k8s by default will look for the k8s api server on `localhost:8001` (kubectl proxy)

If you are running mcs in your local environment and wish to make request to `Kubernetes` you can set `MCS_K8S_API_SERVER`, if
the environment variable is not present by default `MCS` will use `"http://localhost:8001"`, additionally you will need to set the
`MCS_OPERATOR_MODE=on` variable to make MCS display the Operator UI.

NOTE: using `kubectl` proxy is for local development only, since every request send to localhost:8001 will bypass service account authentication
more info here: https://kubernetes.io/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api
you can override this using `MCS_K8S_API_SERVER`, ie use the k8s cluster from `kubectl config view`

## Extract the Service account token and use it with MCS

For local development you can use the jwt associated to the `mcs-sa` service account, you can get the token running
the following command in your terminal:

```
kubectl get secret $(kubectl get serviceaccount mcs-sa -o jsonpath="{.secrets[0].name}") -o jsonpath="{.data.token}" | base64 --decode
```

Then run the mcs server

```
MCS_OPERATOR_MODE=on ./mcs server
```
