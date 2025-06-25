#!/bin/bash
set -e

echo "=== Fix Path Module Build Process ==="

echo "Current directory: $(pwd)"
echo "Contents:"
ls -la

echo "=== Installing dependencies ==="
npm install

echo "=== Ensuring Node.js types are available ==="
# Force install @types/node to fix path module issue
npm install --save-dev @types/node@^20.11.19

echo "=== Verifying TypeScript configuration ==="
# Check if tsconfig.json has the correct types
if grep -q '"types": \["node"\]' tsconfig.json; then
    echo "✅ TypeScript config has Node.js types"
else
    echo "⚠️  TypeScript config missing Node.js types, adding them..."
    # Add types array if it doesn't exist
    sed -i.bak 's/"lib": \["es2017", "esnext.asynciterable"\]/"lib": ["es2017", "esnext.asynciterable"],\n    "types": ["node"]/' tsconfig.json
fi

echo "=== Generating Prisma client ==="
npx prisma generate

echo "=== Building TypeScript ==="
npm run build

echo "=== Build completed successfully ==="
ls -la dist/ 