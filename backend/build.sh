#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Building TypeScript..."
npm run build

echo "Verifying build..."
chmod +x verify-build.sh
./verify-build.sh

echo "Build completed successfully!"
ls -la dist/ 