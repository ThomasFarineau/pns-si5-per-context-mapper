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

cd parser
mvn clean package
mv target/parser-1.0-jar-with-dependencies.jar ../parser-1.0-jar-with-dependencies.jar
cd ..
java -jar parser-1.0-jar-with-dependencies.jar --inputs=./models --output=./output

rm parser-1.0-jar-with-dependencies.jar