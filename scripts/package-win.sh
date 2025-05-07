#!/bin/bash
set -e

echo "---Packaging app for Windows---"
./scripts/build-frontend.sh
./scripts/build-backend.sh
npm run build:win