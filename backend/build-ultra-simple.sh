#!/bin/bash
set -e

echo "=== Ultra Simple Build ==="

echo "Current directory: $(pwd)"

echo "=== Installing dependencies ==="
npm install

echo "=== Running build with npm ==="
# Use npm run build which will handle everything
npm run build

echo "=== Build completed ==="
ls -la dist/ 