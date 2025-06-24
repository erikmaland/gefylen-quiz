# Backend Deployment Guide - Render

## Quick Deployment Steps

1. **Connect Repository**: Link your GitHub repository to Render
2. **Create Web Service**: 
   - Root Directory: `backend`
   - Build Command: `chmod +x build.sh && ./build.sh`
   - Start Command: `npm start`
3. **Set Environment Variables**:
   - `NODE_ENV=production`
   - `PORT=3000`
   - `DATABASE_URL` (auto-set by Render)
4. **Deploy**: Click "Create Web Service"

## Troubleshooting "Could not find Prisma Schema"

This error occurs when Prisma can't locate the schema file or the database configuration is incorrect.

### 1. Prisma Schema Configuration

The schema file (`prisma/schema.prisma`) must be configured for PostgreSQL:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Environment Variables

Ensure `DATABASE_URL` is set correctly in Render:
- Format: `postgresql://username:password@host:port/database`
- Render automatically sets this when you create a PostgreSQL database

### 3. Build Process

The build script (`build.sh`) handles:
1. **Install dependencies**: `npm install`
2. **Check schema exists**: Verify `prisma/schema.prisma` file exists
3. **Generate Prisma client**: `npx prisma generate --schema=./prisma/schema.prisma`
4. **Run migrations**: `npx prisma migrate deploy --schema=./prisma/schema.prisma`
5. **Compile TypeScript**: `npm run build`
6. **Verify build**: Check that all files exist

### 4. Alternative Build Commands

If the main build script fails, try these alternatives in Render:

#### Option 1: Updated main script (with absolute paths)
```
Build Command: chmod +x build.sh && ./build.sh
```

#### Option 2: Simple build script (with absolute paths)
```
Build Command: chmod +x build-simple.sh && ./build-simple.sh
```

#### Option 3: Minimal build script (no explicit paths)
```
Build Command: chmod +x build-minimal.sh && ./build-minimal.sh
```

#### Option 4: Direct npm commands
```
Build Command: npm install && npm run build
```

#### Option 5: Explicit Prisma commands
```
Build Command: npm install && npx prisma generate --schema=./prisma/schema.prisma && npm run build
```

### 5. File Structure Verification

Ensure your backend directory has this structure:
```
backend/
├── prisma/
│   ├── schema.prisma          # Main schema file
│   ├── migrations/            # Migration files
│   └── seed.ts               # Seed file
├── src/
│   └── server.ts             # Main server file
├── package.json              # Dependencies
├── build.sh                  # Build script
└── build-simple.sh           # Alternative build script
```

### 6. Common Causes and Solutions

#### **Schema file not found**
```
Error: Could not find Prisma Schema that is required for this command.
```
**Solutions**:
1. Check that `prisma/schema.prisma` exists in your repository
2. Use explicit schema path: `--schema=./prisma/schema.prisma`
3. Verify file permissions on Render

#### **Wrong working directory**
```
Error: Could not find Prisma Schema
```
**Solution**: Ensure build command runs from the `backend` directory:
```bash
# In Render, set Root Directory to: backend
# Build Command: chmod +x build.sh && ./build.sh
```

#### **Environment variable issues**
```
Error: P1001: Can't reach database server
```
**Solution**: 
1. Check that `DATABASE_URL` is set in Render environment variables
2. Ensure PostgreSQL database is created in Render dashboard
3. Verify the database URL format is correct

### 7. Database Setup

**For Render Deployment**:
1. Create PostgreSQL database in Render dashboard
2. The `DATABASE_URL` will be automatically set
3. Migrations will run during build process

**For Local Development**:
```bash
# Use SQLite for local development
cp prisma/schema.sqlite.prisma prisma/schema.prisma
npx prisma migrate dev
```

## Troubleshooting "Cannot find module '/app/dist/server.js'"

This error occurs when the build process fails to create the expected output file. Here's how to fix it:

### 1. Check Build Logs
- Go to your Render service dashboard
- Click on "Logs" tab
- Look for build errors in the latest deployment

### 2. Common Causes and Solutions

#### **Missing Dependencies**
```
Error: Cannot find module 'express'
```
**Solution**: Ensure all dependencies are in `package.json`:
```json
{
  "dependencies": {
    "@prisma/client": "^5.10.0",
    "cors": "^2.8.5",
    "dotenv-flow": "^4.1.0",
    "express": "^4.18.2"
  }
}
```

#### **Prisma Client Not Generated**
```
Error: Cannot find module '@prisma/client'
```
**Solution**: The build script now includes Prisma generation:
```bash
# build.sh ensures this runs
npx prisma generate
```

#### **TypeScript Compilation Errors**
```
Error: TypeScript compilation failed
```
**Solution**: Check for TypeScript errors locally:
```bash
cd backend
npm run build
```

#### **Permission Issues**
```
Error: Permission denied
```
**Solution**: The build script handles permissions:
```bash
chmod +x build.sh && ./build.sh
```

### 3. Manual Verification

Test the build process locally before deploying:

```bash
cd backend
./build.sh
```

Expected output:
```
✅ Build verification passed!
✅ dist/server.js exists
✅ Prisma client generated
✅ Ready for deployment
```

### 4. Environment Variables

Ensure these are set in Render:
- `NODE_ENV=production`
- `PORT=3000` (Render uses 3000, not 5000)
- `DATABASE_URL` (auto-set by Render database)

### 5. File Structure After Build

After successful build, you should have:
```
backend/
├── dist/
│   ├── server.js          # Main server file
│   ├── server.js.map      # Source maps
│   ├── lib/
│   └── config/
├── node_modules/
│   └── @prisma/client/    # Generated Prisma client
└── package.json
```

### 6. Health Check

The backend includes a health check endpoint:
```
GET /api/health
```

Expected response:
```json
{"status":"ok"}
```

### 7. Database Connection

If you get database connection errors:
1. Check that `DATABASE_URL` is set correctly
2. Ensure the database is created and accessible
3. Run migrations if needed:
   ```bash
   npx prisma migrate deploy
   ```

### 8. CORS Issues

If frontend can't connect to backend:
1. Check that CORS is configured correctly
2. Verify the frontend URL is allowed
3. Ensure the API URL is correct in frontend environment variables

## Build Script Details

The `build.sh` script performs these steps:
1. **Install dependencies**: `npm install`
2. **Generate Prisma client**: `npx prisma generate`
3. **Run migrations**: `npx prisma migrate deploy`
4. **Compile TypeScript**: `npm run build`
5. **Verify build**: Check that all required files exist

## Alternative Build Commands

If the build script fails, try these alternatives:

### Option 1: Simple npm commands
```
Build Command: npm install && npm run build
```

### Option 2: With explicit Prisma generation
```
Build Command: npm install && npx prisma generate && npm run build
```

### Option 3: With environment setup
```
Build Command: npm install && npx prisma generate && npm run build
```

## Support

If you continue to have issues:
1. Check the Render documentation
2. Review the build logs carefully
3. Test the build process locally first
4. Ensure all files are committed to your repository 