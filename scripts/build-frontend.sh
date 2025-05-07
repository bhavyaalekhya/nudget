#!/bin/bash
set -e

echo "---Building and exporting frontend---"
cd frontend
npm run build
npm run export