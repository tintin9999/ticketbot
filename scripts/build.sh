#!/usr/bin/env bash

BLUE='\033[1;34m'
NC='\033[0m'

rm ./build -rf && echo -e "[${BLUE}INFO${NC}] Deleted build folder."
tsc -p tsconfig.json && echo -e "[${BLUE}INFO${NC}] Build complete."
