#!/bin/bash
set -e

echo "=== Simple Inline Build (No Types Issue) ==="

echo "Current directory: $(pwd)"

echo "=== Installing dependencies ==="
npm install

echo "=== Generating Prisma client ==="
npx prisma generate

echo "=== Building with TypeScript (skipLibCheck) ==="
# Use TypeScript directly with skipLibCheck to avoid types issues
npx tsc --skipLibCheck

echo "=== Build completed ==="
ls -la dist/ 