#! /bin/bash

# Path to this plugin 
PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"
 
# Directory to write generated code to (.js and .d.ts files) 
JS_OUT_DIR="./js"
 
protoc \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --js_out="import_style=commonjs,binary:${JS_OUT_DIR}" \
    --ts_out="${JS_OUT_DIR}" \
    *.proto