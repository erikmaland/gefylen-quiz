#!/bin/bash
set -e

echo "=== Robust Types Build (Handles All Type Issues) ==="

echo "Current directory: $(pwd)"

echo "=== Installing dependencies ==="
npm install

echo "=== Installing @types/node with multiple approaches ==="
# Try multiple approaches to install @types/node
echo "Attempt 1: Install specific version..."
npm install --save-dev @types/node@^20.11.19 || {
    echo "Attempt 1 failed, trying latest version..."
    npm install --save-dev @types/node@latest || {
        echo "Attempt 2 failed, trying without version..."
        npm install --save-dev @types/node || {
            echo "All @types/node installation attempts failed, proceeding without explicit types..."
        }
    }
}

echo "=== Verifying @types/node installation ==="
if [ -d "node_modules/@types/node" ]; then
    echo "✅ @types/node is installed"
    ls -la node_modules/@types/node/
else
    echo "⚠️  @types/node is not installed, will use skipLibCheck"
fi

echo "=== Creating temporary tsconfig without explicit types ==="
# Create a temporary tsconfig that doesn't use explicit types to avoid the error
cp tsconfig.json tsconfig.json.backup
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "lib": ["es2017", "esnext.asynciterable"],
    "skipLibCheck": true,
    "sourceMap": true,
    "outDir": "./dist",
    "moduleResolution": "node",
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "forceConsistentCasingInFileNames": true
  },
  "exclude": ["node_modules", "dist"],
  "include": ["./src/**/*.ts"]
}
EOF

echo "✅ Created temporary tsconfig.json without explicit types"

echo "=== Generating Prisma client ==="
npx prisma generate

echo "=== Building with npm run build ==="
# Use npm run build which includes skipLibCheck
npm run build

echo "=== Restoring original tsconfig.json ==="
mv tsconfig.json.backup tsconfig.json
echo "✅ Restored original tsconfig.json"

echo "=== Build completed successfully ==="
ls -la dist/ 