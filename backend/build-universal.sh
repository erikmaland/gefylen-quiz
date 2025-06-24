#!/bin/bash
set -e

echo "=== Universal Build Process for Render ==="

# Extensive debugging information
echo "=== Environment Debug ==="
echo "Current directory: $(pwd)"
echo "Script location: $(dirname "$0")"
echo "Script name: $(basename "$0")"
echo "HOME: $HOME"
echo "PWD: $PWD"

echo "=== Directory Contents ==="
echo "Current directory contents:"
ls -la

echo "=== Parent directory contents:"
ls -la .. 2>/dev/null || echo "Cannot access parent directory"

echo "=== Installing dependencies ==="
npm install

echo "=== Comprehensive Schema Search ==="
# Try every possible location for the schema file
SCHEMA_PATHS=(
    "prisma/schema.prisma"
    "./prisma/schema.prisma"
    "$(dirname "$0")/prisma/schema.prisma"
    "backend/prisma/schema.prisma"
    "../backend/prisma/schema.prisma"
    "$(pwd)/prisma/schema.prisma"
    "$(dirname "$0")/../prisma/schema.prisma"
    "prisma/schema.prisma"
)

echo "Searching for schema file..."
SCHEMA_FOUND=""
for path in "${SCHEMA_PATHS[@]}"; do
    echo "Checking: $path"
    if [ -f "$path" ]; then
        echo "✅ FOUND: $path"
        SCHEMA_FOUND="$path"
        echo "File details:"
        ls -la "$path"
        break
    else
        echo "❌ Not found: $path"
    fi
done

if [ -z "$SCHEMA_FOUND" ]; then
    echo "❌ ERROR: Could not find prisma/schema.prisma in any expected location"
    echo "=== Comprehensive File Search ==="
    echo "Searching for any .prisma files in current directory:"
    find . -name "*.prisma" 2>/dev/null || echo "No .prisma files found in current directory"
    
    echo "Searching for any .prisma files in parent directory:"
    find .. -name "*.prisma" 2>/dev/null || echo "No .prisma files found in parent directory"
    
    echo "Searching for prisma directories:"
    find . -name "prisma" -type d 2>/dev/null || echo "No prisma directories found"
    
    echo "=== Directory Tree (limited) ==="
    find . -maxdepth 3 -type d 2>/dev/null | head -20
    
    exit 1
fi

echo "=== Using schema at: $SCHEMA_FOUND ==="

echo "=== Generating Prisma client ==="
npx prisma generate --schema="$SCHEMA_FOUND"

echo "=== Building TypeScript ==="
npm run build

echo "=== Build completed successfully ==="
echo "Final directory contents:"
ls -la
echo "Dist directory contents:"
ls -la dist/ 