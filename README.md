# Gefylen Quiz & Recipe Application

A full-stack quiz and recipe application built with Next.js (frontend) and Express.js (backend) with Prisma ORM and PostgreSQL database.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (for production)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd gefylen-quiz
   ```

2. **Install dependencies**:
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend && npm install
   
   # Install backend dependencies
   cd ../backend && npm install
   ```

3. **Set up environment variables**:
   
   Create `frontend/.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
   
   Create `backend/.env`:
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/gefylen_quiz"
   NODE_ENV=development
   PORT=5000
   ```

4. **Set up the database**:
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development servers**:
   ```bash
   # From the root directory
   npm run dev
   ```
   
   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🏗️ Project Structure

```
gefylen-quiz/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── components/      # React components
│   │   └── lib/             # Utility functions and API
│   ├── render.yaml          # Render deployment config
│   └── vercel.json          # Vercel deployment config
├── backend/                  # Express.js backend API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── models/          # Database models
│   │   └── server.ts        # Main server file
│   ├── prisma/              # Database schema and migrations
│   ├── render.yaml          # Render deployment config
│   └── Dockerfile           # Docker configuration
└── package.json             # Root package.json for concurrent dev
```

## 🌐 Deployment Guide

### Render Deployment (Recommended)

This project is configured for easy deployment on Render with automatic database provisioning.

#### Prerequisites
1. [Render Account](https://render.com)
2. GitHub repository with your code
3. Git knowledge

#### Step 1: Deploy Backend

1. **Create Web Service**:
   - Go to Render Dashboard → "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure settings:
     - **Name**: `gefylen-quiz-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npx prisma generate && npm run build`
     - **Start Command**: `npm start`

2. **Environment Variables**:
   ```bash
   NODE_ENV=production
   PORT=3000
   ```
   - `DATABASE_URL` will be automatically set by Render

3. **Database**:
   - Render will automatically create a PostgreSQL database
   - The `render.yaml` file handles the database connection

4. **Deploy**: Click "Create Web Service"

#### Step 2: Deploy Frontend

1. **Create Web Service**:
   - Go to Render Dashboard → "New +" → "Web Service"
   - Connect the same GitHub repository
   - Configure settings:
     - **Name**: `gefylen-quiz-frontend`
     - **Root Directory**: `frontend`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`

2. **Environment Variables**:
   ```bash
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://your-backend-service-name.onrender.com/api
   ```

3. **Deploy**: Click "Create Web Service"

#### Step 3: Update Configuration Files

After deployment, update the API URLs in your configuration files:

**`frontend/render.yaml`**:
```yaml
services:
  - type: web
    name: gefylen-quiz-frontend
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: NEXT_PUBLIC_API_URL
        value: https://your-backend-service-name.onrender.com/api
    healthCheckPath: /
    autoDeploy: true
```

**`frontend/vercel.json`** (for Vercel alternative):
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "regions": ["fra1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://your-backend-service-name.onrender.com/api"
  }
}
```

### Alternative Deployment Options

#### Vercel (Frontend Only)
- Use the `vercel.json` configuration
- Deploy only the frontend to Vercel
- Use a separate backend service (Render, Railway, etc.)

#### Railway
- Similar to Render with automatic deployments
- Good for full-stack applications

#### Netlify
- Good for frontend deployment
- Requires separate backend service

## 🔧 Configuration

### Environment Variables

#### Frontend (`.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api  # Development
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api  # Production
```

#### Backend (`.env`)
```bash
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=development  # or production
PORT=5000  # or 3000 for Render
```

### Database

The application uses PostgreSQL with Prisma ORM:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# View database (development)
npx prisma studio
```

## 🚀 Features

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Quiz Management**: Create, edit, and take quizzes
- **Recipe Management**: Browse and manage recipes
- **Admin Panel**: Protected admin interface
- **Responsive Design**: Works on all devices

### Backend
- **Express.js** REST API
- **Prisma ORM** with PostgreSQL
- **TypeScript** for type safety
- **CORS** enabled for frontend communication
- **Environment-based configuration**
- **Health check endpoint**

## 📝 API Endpoints

### Quizzes
- `GET /api/quiz` - Get all quizzes
- `GET /api/quiz/:id` - Get specific quiz
- `POST /api/quiz` - Create new quiz
- `PUT /api/quiz/:id` - Update quiz
- `DELETE /api/quiz/:id` - Delete quiz

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get specific recipe
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

### Health
- `GET /health` - Health check endpoint

## 🛠️ Development

### Available Scripts

**Root Directory**:
```bash
npm run dev          # Start both frontend and backend
```

**Frontend**:
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

**Backend**:
```bash
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run start        # Start production server
```

### Database Management

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (development only)
npx prisma migrate reset

# View database schema
npx prisma studio
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Kill process on port 5000
   lsof -ti:5000 | xargs kill -9
   ```

2. **Database connection issues**:
   - Check DATABASE_URL format
   - Ensure database is running
   - Verify network connectivity

3. **Build failures**:
   - Check Node.js version (18+ required)
   - Clear node_modules and reinstall
   - Check for TypeScript errors

4. **CORS issues**:
   - Verify frontend URL is allowed in backend CORS config
   - Check environment variables

### Deployment Issues

1. **Environment Variables**: Ensure all required variables are set
2. **Build Commands**: Verify build commands are correct
3. **Database**: Check database connection and migrations
4. **API URLs**: Confirm frontend can reach backend API

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the deployment logs in your hosting platform 