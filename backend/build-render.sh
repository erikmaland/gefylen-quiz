#!/bin/bash
set -e

echo "=== Render Build Process ==="

# Debug information
echo "Current directory: $(pwd)"
echo "Script location: $(dirname "$0")"
echo "Contents of current directory:"
ls -la

echo "=== Installing dependencies ==="
npm install

echo "=== Checking for Prisma schema ==="
# Try multiple possible locations for the schema file
SCHEMA_PATHS=(
    "prisma/schema.prisma"
    "./prisma/schema.prisma"
    "$(dirname "$0")/prisma/schema.prisma"
    "backend/prisma/schema.prisma"
)

SCHEMA_FOUND=""
for path in "${SCHEMA_PATHS[@]}"; do
    if [ -f "$path" ]; then
        echo "✅ Found schema at: $path"
        SCHEMA_FOUND="$path"
        break
    else
        echo "❌ Not found: $path"
    fi
done

if [ -z "$SCHEMA_FOUND" ]; then
    echo "❌ ERROR: Could not find prisma/schema.prisma in any expected location"
    echo "Searching for any .prisma files:"
    find . -name "*.prisma" 2>/dev/null || echo "No .prisma files found"
    exit 1
fi

echo "=== Generating Prisma client ==="
npx prisma generate --schema="$SCHEMA_FOUND"

echo "=== Building TypeScript ==="
npm run build

echo "=== Build completed successfully ==="
ls -la dist/ 