#!/bin/bash
set -e

echo "Minimal build process..."

echo "Installing dependencies..."
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Building TypeScript..."
npm run build

echo "Build completed!"
ls -la dist/ 