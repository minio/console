#!/usr/bin/env python
# -*- coding: utf-8 -*-

import pdb
import requests
from bs4 import BeautifulSoup

result = requests.get('http://localhost:9001/api/v1/login')
redirect = result.json()['redirect']
result = requests.get(redirect)
soup = BeautifulSoup(result.text, "html.parser")

# Log in to Your Account via OpenLDAP Connector
url = "http://dex:5556" + soup.findAll('a')[1].get('href')
result = requests.get(url)
soup = BeautifulSoup(result.text, "html.parser")
url = "http://dex:5556" + soup.form.get('action')

# Post the credentials in the form
# From https://github.com/minio/minio-iam-testing/blob/main/ldap/bootstrap.ldif
myobj = {
    'login': 'dillon@example.io',
    'password': 'dillon',
}
result2 = requests.post(url, data = myobj)
code  = result2.url.split("?code=")[1].split("&state=")[0]
state = result2.url.split("?code=")[1].split("&state=")[1]

print(code)
print(state)
