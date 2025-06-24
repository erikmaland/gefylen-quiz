#!/bin/bash
set -e

echo "Simple build process for Render..."

# Get the absolute path to the backend directory
BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Backend directory: $BACKEND_DIR"

echo "Installing dependencies..."
npm install

echo "Generating Prisma client with explicit schema path..."
SCHEMA_PATH="$BACKEND_DIR/prisma/schema.prisma"
echo "Using schema at: $SCHEMA_PATH"
npx prisma generate --schema="$SCHEMA_PATH"

echo "Building TypeScript..."
npm run build

echo "Build completed!"
ls -la dist/ 