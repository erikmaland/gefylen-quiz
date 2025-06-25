#!/bin/bash
set -e

echo "=== NPX Build (Ensures TypeScript Available) ==="

echo "Current directory: $(pwd)"

echo "=== Installing dependencies ==="
npm install

echo "=== Generating Prisma client ==="
npx prisma generate

echo "=== Building with npx tsc ==="
# Use npx to ensure TypeScript is available
npx tsc --skipLibCheck

echo "=== Build completed ==="
ls -la dist/ 