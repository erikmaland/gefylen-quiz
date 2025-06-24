#!/bin/bash
set -e

echo "=== Render Build Process (Root Directory: backend) ==="

# Debug information for Render environment
echo "=== Environment Debug ==="
echo "Current directory: $(pwd)"
echo "Script location: $(dirname "$0")"
echo "Script name: $(basename "$0")"
echo "HOME: $HOME"
echo "PWD: $PWD"

echo "=== Directory Contents ==="
echo "Current directory contents:"
ls -la

echo "=== Installing dependencies ==="
npm install

echo "=== Prisma Schema Location Check ==="
# When root directory is 'backend', the schema should be at prisma/schema.prisma
SCHEMA_PATH="prisma/schema.prisma"

echo "Expected schema path: $SCHEMA_PATH"
if [ -f "$SCHEMA_PATH" ]; then
    echo "✅ Schema file found at: $SCHEMA_PATH"
    echo "File details:"
    ls -la "$SCHEMA_PATH"
else
    echo "❌ Schema file NOT found at: $SCHEMA_PATH"
    echo "=== Searching for schema files ==="
    find . -name "*.prisma" 2>/dev/null || echo "No .prisma files found"
    echo "=== Prisma directory contents ==="
    ls -la prisma/ 2>/dev/null || echo "prisma directory not found"
    exit 1
fi

echo "=== Generating Prisma client ==="
npx prisma generate --schema="$SCHEMA_PATH"

echo "=== Building TypeScript ==="
npm run build

echo "=== Build completed successfully ==="
echo "Final directory contents:"
ls -la
echo "Dist directory contents:"
ls -la dist/ 