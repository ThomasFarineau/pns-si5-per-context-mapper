#!/bin/bash

cd discovery

npm run build:dist

npm run exec:windows

cd ..

cd sandbox/context-mapper-forward

mvn clean package

mvn exec:java