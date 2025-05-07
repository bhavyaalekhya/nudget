#!/bin/bash
set -e

echo "---Building frontend---"
cd frontend
npm run build

echo "---Building backend---"
cd backend
npm run build

echo "---Starting electron---"
cd ..
npm run start