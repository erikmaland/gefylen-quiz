#!/bin/bash
set -e

echo "=== Build Without Node Types (Alternative Approach) ==="

echo "Current directory: $(pwd)"
echo "Contents:"
ls -la

echo "=== Installing dependencies ==="
npm install

echo "=== Creating temporary TypeScript config without types ==="
# Create a temporary tsconfig that doesn't use explicit types
cp tsconfig.json tsconfig.json.original
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

echo "=== Building TypeScript ==="
npm run build

echo "=== Restoring original TypeScript config ==="
mv tsconfig.json.original tsconfig.json
echo "✅ Restored original tsconfig.json"

echo "=== Build completed successfully ==="
ls -la dist/ 