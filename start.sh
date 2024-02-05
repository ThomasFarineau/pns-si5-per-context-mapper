#!/bin/bash

cd discovery

npm start

cd ..

cd sandbox/context-mapper-forward

mvn clean package

mvn exec:java