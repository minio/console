#!/usr/bin/env python
# -*- coding: utf-8 -*-

import pdb, sys, requests, pdb
from bs4 import BeautifulSoup
from urllib.parse import unquote

# Log in to Your Account via OpenLDAP Connector
result = requests.get(sys.argv[1])
soup = BeautifulSoup(result.text, "html.parser")
url = "http://dex:5556" + soup.findAll('a')[1].get('href')
result = requests.get(url)
soup = BeautifulSoup(result.text, "html.parser")
url = "http://dex:5556" + soup.form.get('action')
print(url)
