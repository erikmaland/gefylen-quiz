#!/bin/bash
set -e

echo "=== NPM-based Build Process ==="

echo "Current directory: $(pwd)"
echo "Contents:"
ls -la

echo "=== Installing dependencies ==="
npm install

echo "=== Running npm build (uses package.json scripts) ==="
npm run build

echo "=== Build completed ==="
ls -la dist/ 