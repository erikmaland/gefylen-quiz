# Docker Setup for Gefylen Quiz Backend

## Overview

This project includes comprehensive Docker support with separate configurations for development and production environments.

## Dockerfiles

### Production Dockerfile (`Dockerfile`)

**Features:**
- Multi-stage build for optimized production images
- Security: Non-root user, dumb-init for signal handling
- Health checks
- Explicit Prisma schema path handling
- Production-optimized dependencies

**Build:**
```bash
docker build -t gefylen-quiz-backend .
```

**Run:**
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/db" \
  -e NODE_ENV=production \
  gefylen-quiz-backend
```

### Development Dockerfile (`Dockerfile.dev`)

**Features:**
- Hot reloading support
- Development dependencies included
- Volume mounting for live code changes
- Health checks

**Build:**
```bash
docker build -f Dockerfile.dev -t gefylen-quiz-backend:dev .
```

**Run:**
```bash
docker run -p 5000:5000 \
  -v $(pwd):/app \
  -e DATABASE_URL="postgresql://user:password@host:5432/db" \
  -e NODE_ENV=development \
  gefylen-quiz-backend:dev
```

## Docker Compose

### Development (`docker-compose.yml`)

**Start the entire stack:**
```bash
docker-compose up -d
```

**Services:**
- **PostgreSQL**: Database with health checks
- **Backend**: Development server with hot reloading
- **Frontend**: Next.js development server

**Ports:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database: localhost:5432

### Production (`docker-compose.prod.yml`)

**Start production stack:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Environment Variables:**
Create a `.env` file:
```bash
POSTGRES_DB=gefylen_quiz
POSTGRES_USER=gefylen_quiz_user
POSTGRES_PASSWORD=your_secure_password
```

## Key Features

### 1. Prisma Schema Handling
- Explicit schema path: `--schema=./prisma/schema.prisma`
- Prisma client generation in build stage
- Schema files copied to production image

### 2. Security
- Non-root user (`nodejs:1001`)
- dumb-init for proper signal handling
- Minimal production dependencies

### 3. Health Checks
- Backend: HTTP health check on `/api/health`
- Database: PostgreSQL readiness check
- Automatic restart policies

### 4. Multi-stage Build
- **Builder stage**: Install dependencies, generate Prisma client, build TypeScript
- **Production stage**: Copy only necessary files, install production dependencies

## Development Workflow

### 1. Start Development Environment
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### 2. Database Operations
```bash
# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Open Prisma Studio
docker-compose exec backend npx prisma studio

# Reset database
docker-compose exec backend npx prisma migrate reset
```

### 3. Code Changes
- Code changes are automatically reflected due to volume mounting
- TypeScript compilation happens automatically
- Hot reloading enabled for development

## Production Deployment

### 1. Build Production Images
```bash
# Build backend
docker build -t gefylen-quiz-backend:latest ./backend

# Build frontend (if you have a frontend Dockerfile)
docker build -t gefylen-quiz-frontend:latest ./frontend
```

### 2. Deploy with Docker Compose
```bash
# Set environment variables
export POSTGRES_PASSWORD="your_secure_password"

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Environment Variables
Required environment variables for production:
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/db
PORT=3000
```

## Troubleshooting

### Common Issues

1. **Prisma Schema Not Found**
   - Ensure schema file exists in `prisma/schema.prisma`
   - Check file permissions
   - Verify Docker build context includes prisma directory

2. **Database Connection Issues**
   - Check DATABASE_URL format
   - Ensure database is running and accessible
   - Verify network connectivity between containers

3. **Permission Issues**
   - Production image runs as non-root user
   - Ensure proper file ownership
   - Check volume mount permissions

### Debug Commands

```bash
# Check container logs
docker-compose logs backend

# Enter container shell
docker-compose exec backend sh

# Check health status
docker-compose ps

# View container details
docker inspect gefylen-quiz-backend
```

## Performance Optimizations

### 1. Build Optimization
- Multi-stage build reduces final image size
- Only production dependencies in final image
- Prisma client generated during build

### 2. Runtime Optimization
- Health checks prevent unnecessary restarts
- Proper signal handling with dumb-init
- Non-root user for security

### 3. Development Optimization
- Volume mounting for live code changes
- Hot reloading enabled
- Shared node_modules volume

## Security Considerations

1. **Non-root User**: Production containers run as non-root
2. **Signal Handling**: dumb-init ensures proper process management
3. **Minimal Dependencies**: Only production dependencies in final image
4. **Health Checks**: Automatic health monitoring
5. **Environment Variables**: Secure credential management

## Monitoring

### Health Checks
- Backend: `GET /api/health`
- Database: PostgreSQL readiness check
- Automatic restart on failure

### Logs
```bash
# View all logs
docker-compose logs

# Follow backend logs
docker-compose logs -f backend

# View specific service logs
docker-compose logs postgres
``` 