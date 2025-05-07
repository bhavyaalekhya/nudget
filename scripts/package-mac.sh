#!/bin/bash
set -e

echo "---Packaging app for macOS---"
./scripts/build-frontend.sh
./scripts/build-backend.sh
npm run build:mac