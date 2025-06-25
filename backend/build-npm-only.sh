#!/bin/bash
set -e

echo "=== NPM Only Build (No Direct TypeScript Calls) ==="

echo "Current directory: $(pwd)"

echo "=== Installing dependencies ==="
npm install

echo "=== Installing @types/node ==="
npm install --save-dev @types/node@^20.11.19

echo "=== Generating Prisma client ==="
npx prisma generate

echo "=== Building with npm run build (no direct tsc) ==="
# Use npm run build which calls the package.json script
npm run build

echo "=== Build completed ==="
ls -la dist/ 