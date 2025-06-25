#!/bin/bash
set -e

echo "=== Inline Build with Types ==="

echo "Current directory: $(pwd)"

echo "=== Installing dependencies ==="
npm install

echo "=== Installing @types/node ==="
npm install --save-dev @types/node@^20.11.19

echo "=== Generating Prisma client ==="
npx prisma generate

echo "=== Building with npm run build ==="
npm run build

echo "=== Build completed ==="
ls -la dist/ 