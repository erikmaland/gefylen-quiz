# Deployment Guide

This guide covers deploying the Gefylen Quiz application to Render.com.

## Prerequisites

- Git repository with your code
- Render.com account
- Domain name (optional)

## Backend Deployment

### 1. Database Setup
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Configure:
   - Name: `gefylen-quiz-db`
   - Database: `gefylen_quiz`
   - User: `gefylen_quiz_user`
   - Plan: Free (or paid for production)
4. Note down the connection string

### 2. Backend Service
1. Click "New +" → "Web Service"
2. Connect your Git repository
3. Configure:
   - Name: `gefylen-quiz-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`
   - Plan: Free (or paid for production)

### 3. Environment Variables
Add these environment variables:
```
NODE_ENV=production
DATABASE_URL=<your-postgres-connection-string>
PORT=3000
```

### 4. Database Migration
After deployment, run database migrations:
1. Go to your backend service
2. Click "Shell"
3. Run: `npx prisma db push`

## Frontend Deployment

### 1. Frontend Service
1. Click "New +" → "Static Site"
2. Connect your Git repository
3. Configure:
   - Name: `gefylen-quiz-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `out`
   - Plan: Free (or paid for production)

### 2. Environment Variables
Add these environment variables:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

## Custom Domain Setup

### 1. Backend Domain
1. Go to your backend service
2. Click "Settings" → "Custom Domains"
3. Add your domain (e.g., `api.gefylenquiz.fun`)
4. Update DNS records as instructed

### 2. Frontend Domain
1. Go to your frontend service
2. Click "Settings" → "Custom Domains"
3. Add your domain (e.g., `gefylenquiz.fun`)
4. Update DNS records as instructed

## Environment Variables Summary

### Backend
```
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3000
```

### Frontend
```
NEXT_PUBLIC_API_URL=https://api.gefylenquiz.fun
```

## Post-Deployment Checklist

- [ ] Database migrations completed
- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] API endpoints responding
- [ ] Custom domains configured
- [ ] SSL certificates active
- [ ] Environment variables set correctly

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure DATABASE_URL is correct
2. **Build Failures**: Check build logs for missing dependencies
3. **CORS Issues**: Verify API URL in frontend environment variables
4. **404 Errors**: Check custom domain DNS settings

### Support
- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com 