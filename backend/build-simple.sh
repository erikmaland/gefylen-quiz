#!/bin/bash
set -e

echo "Simple build process for Render..."

echo "Installing dependencies..."
npm install

echo "Generating Prisma client with explicit schema path..."
npx prisma generate --schema=prisma/schema.prisma

echo "Building TypeScript..."
npm run build

echo "Build completed!"
ls -la dist/ 