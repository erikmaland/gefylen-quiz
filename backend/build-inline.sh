#!/bin/bash
set -e

echo "=== Inline Build Process ==="

echo "Current directory: $(pwd)"
echo "Contents:"
ls -la

echo "=== Installing dependencies ==="
npm install

echo "=== Generating Prisma client (inline) ==="
# Use inline commands to avoid path issues
npx prisma generate

echo "=== Building TypeScript (inline) ==="
npx tsc

echo "=== Build completed ==="
ls -la dist/ 