#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

# Get the absolute path to the backend directory
BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Backend directory: $BACKEND_DIR"

echo "Checking Prisma schema..."
SCHEMA_PATH="$BACKEND_DIR/prisma/schema.prisma"
if [ ! -f "$SCHEMA_PATH" ]; then
    echo "❌ Error: Prisma schema not found at $SCHEMA_PATH"
    echo "Current directory: $(pwd)"
    echo "Contents of prisma directory:"
    ls -la prisma/ 2>/dev/null || echo "prisma directory not found"
    exit 1
fi

echo "Prisma schema found at: $SCHEMA_PATH"

echo "Generating Prisma client..."
npx prisma generate --schema="$SCHEMA_PATH"

echo "Running database migrations..."
npx prisma migrate deploy --schema="$SCHEMA_PATH" || echo "No migrations to run or database not available"

echo "Building TypeScript..."
npm run build

echo "Verifying build..."
chmod +x verify-build.sh
./verify-build.sh

echo "Build completed successfully!"
ls -la dist/ 