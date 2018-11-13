#!/bin/bash
SOURCE_FILE="http://download.geonames.org/export/dump/cities500.zip"

# Load data
curl -sS $SOURCE_FILE > source_file.zip && rm -f cities500.txt
unzip source_file.zip && rm source_file.zip
mv cities500.txt output/html/

# Build functions
yarn run netlify-lambda build functions
