#!/bin/bash

cd discovery

npm run build

if [ $# -eq 0 ]; then
    echo "No repo provided. Running local."
    npm run exec:windows -- -sn
else
    echo "Repo is provided: $1. Using it."
    npm run exec:windows -- --repo=$1 -sn
fi

cd ..

cd sandbox/context-mapper-forward

mvn clean package

mvn exec:java