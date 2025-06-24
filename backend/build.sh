#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Running database migrations..."
npx prisma migrate deploy || echo "No migrations to run or database not available"

echo "Building TypeScript..."
npm run build

echo "Verifying build..."
chmod +x verify-build.sh
./verify-build.sh

echo "Build completed successfully!"
ls -la dist/ 