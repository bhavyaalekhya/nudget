#!/bin/bash
set -e

echo "----Setting up database----"
cd backend
npx prisma generate
npx prisma db push