#!/bin/bash

# setup environment variables based on flags to see if we should build the docker containers again
MCS_DOCKER="true"

# evaluate flags
# `-m` for mcs


while getopts ":m:" opt; do
  case $opt in
    m)
	  MCS_DOCKER="$OPTARG"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

echo "Provisioning Kind"
kind create cluster  --config kind-cluster.yaml
echo "Remove Master Taint"
kubectl taint nodes --all node-role.kubernetes.io/master-
echo "Install Contour"
kubectl apply -f https://projectcontour.io/quickstart/contour.yaml
kubectl patch daemonsets -n projectcontour envoy -p '{"spec":{"template":{"spec":{"nodeSelector":{"ingress-ready":"true"},"tolerations":[{"key":"node-role.kubernetes.io/master","operator":"Equal","effect":"NoSchedule"}]}}}}'
echo "install metrics server"
kubectl apply -f metrics-dev.yaml

# Whether or not to build the m3 container and load it to kind or just load it
if [[ $MCS_DOCKER == "true" ]]; then
	# Build mkube
  make --directory=".." k8sdev TAG=minio/mcs:latest
else
	kind load docker-image minio/mcs:latest
fi

echo "done"
