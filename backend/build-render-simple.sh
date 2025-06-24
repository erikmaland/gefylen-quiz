#!/bin/bash
set -e

echo "=== Simple Render Build (Root Directory: backend) ==="

echo "Current directory: $(pwd)"
echo "Contents:"
ls -la

echo "=== Installing dependencies ==="
npm install

echo "=== Generating Prisma client (simple) ==="
# Use the most basic Prisma command without explicit schema path
npx prisma generate

echo "=== Building TypeScript ==="
npm run build

echo "=== Build completed ==="
ls -la dist/ 