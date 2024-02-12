#!/bin/bash

cd discovery

npm run build

npm run exec:windows -- -sn

cd ..

cd sandbox/context-mapper-forward

mvn clean package

mvn exec:java