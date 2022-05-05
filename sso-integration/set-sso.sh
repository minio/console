#!/bin/sh

echo "127.0.0.1 dex" | sudo tee -a /etc/hosts
echo " "
echo " "
echo "/etc/hosts:"
cat /etc/hosts
echo " "
echo " "
