#!/bin/bash

echo "Verifying build process..."

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found"
    exit 1
fi

# Check if server.js exists
if [ ! -f "dist/server.js" ]; then
    echo "❌ Error: dist/server.js not found"
    echo "Contents of dist directory:"
    ls -la dist/
    exit 1
fi

# Check if Prisma client exists
if [ ! -d "node_modules/@prisma/client" ]; then
    echo "❌ Error: Prisma client not found"
    exit 1
fi

echo "✅ Build verification passed!"
echo "✅ dist/server.js exists"
echo "✅ Prisma client generated"
echo "✅ Ready for deployment" 