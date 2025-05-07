#!/bin/bash
set -e

echo "---Building front end and back end environments---"
cp backend/.env.example backend/.env

cp frontend/.env.example frontend/.env