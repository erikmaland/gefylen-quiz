#!/bin/bash
set -e

echo "=== Fix Process Error Build ==="

echo "Current directory: $(pwd)"

echo "=== Installing dependencies ==="
npm install

echo "=== Ensuring @types/node is properly installed ==="
# Force install @types/node to fix process error
npm install --save-dev @types/node@^20.11.19

echo "=== Verifying @types/node installation ==="
if [ -d "node_modules/@types/node" ]; then
    echo "✅ @types/node is installed"
    ls -la node_modules/@types/node/
else
    echo "❌ @types/node is not installed, trying alternative approach..."
    npm install --save-dev @types/node@latest
fi

echo "=== Verifying TypeScript configuration ==="
# Check if tsconfig.json has the correct types
if grep -q '"types": \["node"\]' tsconfig.json; then
    echo "✅ TypeScript config has Node.js types"
else
    echo "⚠️  TypeScript config missing Node.js types, adding them..."
    # Add types array if it doesn't exist
    sed -i.bak 's/"lib": \["es2017", "esnext.asynciterable"\]/"lib": ["es2017", "esnext.asynciterable"],\n    "types": ["node"]/' tsconfig.json
    echo "✅ Updated tsconfig.json with Node.js types"
fi

echo "=== Generating Prisma client ==="
npx prisma generate

echo "=== Building with npm run build ==="
# Use npm run build which includes skipLibCheck
npm run build

echo "=== Build completed successfully ==="
ls -la dist/ 