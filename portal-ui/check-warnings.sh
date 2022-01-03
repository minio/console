#!/bin/bash

if yarn build | grep "Compiled with warnings"; then
  echo "There are warnings in the code"
  exit 2
else
  echo "All good"
fi