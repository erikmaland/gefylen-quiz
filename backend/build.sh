#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Checking Prisma schema..."
if [ ! -f "prisma/schema.prisma" ]; then
    echo "❌ Error: prisma/schema.prisma not found"
    echo "Current directory: $(pwd)"
    echo "Contents of prisma directory:"
    ls -la prisma/
    exit 1
fi

echo "Prisma schema found at: $(pwd)/prisma/schema.prisma"

echo "Generating Prisma client..."
npx prisma generate --schema=./prisma/schema.prisma

echo "Running database migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma || echo "No migrations to run or database not available"

echo "Building TypeScript..."
npm run build

echo "Verifying build..."
chmod +x verify-build.sh
./verify-build.sh

echo "Build completed successfully!"
ls -la dist/ 