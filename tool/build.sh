#!/bin/bash

root_dir=$(cd $(dirname $0) && pwd)/..

cd ${root_dir}

EXE=0

for OPT in "$@"
do
  echo $OPT
  if [ $OPT = "--exe" ]; then
    EXE=1
  fi
  shift
done


rm dist -rf
npm run gulp

if [ $EXE == "1" ]; then
  echo "=== execute javascript ==="
  node dist/js/main.js --headless
fi
