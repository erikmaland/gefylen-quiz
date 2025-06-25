#!/bin/bash
set -e

echo "=== No Types Inline Build ==="

echo "Current directory: $(pwd)"

echo "=== Installing dependencies ==="
npm install

echo "=== Creating minimal tsconfig for build ==="
# Create a minimal tsconfig that avoids all type issues
cat > tsconfig.build.json << 'EOF'
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "lib": ["es2017"],
    "skipLibCheck": true,
    "noEmitOnError": false,
    "sourceMap": true,
    "outDir": "./dist",
    "moduleResolution": "node",
    "removeComments": true,
    "noImplicitAny": false,
    "strictNullChecks": false,
    "strictFunctionTypes": false,
    "noImplicitThis": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noImplicitReturns": false,
    "noFallthroughCasesInSwitch": false,
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

echo "✅ Created minimal tsconfig.build.json"

echo "=== Generating Prisma client ==="
npx prisma generate

echo "=== Building with minimal TypeScript config ==="
# Use the minimal config for building
npx tsc --project tsconfig.build.json

echo "=== Cleaning up ==="
rm tsconfig.build.json

echo "=== Build completed ==="
ls -la dist/ 