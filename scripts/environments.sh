#!/bin/bash
set -e

echo "----Installing backend env----"
cp backend/.env.example backend/.env

echo "----Installing frontend env----"
cp frontend/.env.example frontend/.env