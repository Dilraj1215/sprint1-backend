# Sprint 1 Backend - Deployment Guide

## Quick Start for Render Deployment

### Step 1: Setup Local Environment

1. **Install dependencies:**
```bash
cd sprint1-backend
npm install
```

2. **Create `.env` file:**
```env
PORT=3000
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=development
```

3. **Test locally:**
```bash
npm run init-db  # Initialize database with tables and sample data
npm start        # Start the server
```

Visit `http://localhost:3000` to see the API welcome message.

### Step 2: Create GitHub Repository

1. Initialize git in your project:
```bash
git init
git add .
git commit -m "Initial commit - Sprint 1 Backend API"
```

2. Create a new repository on GitHub

3. Push your code:
```bash
git remote add origin https://github.com/yourusername/sprint1-backend.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Render

#### Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **PostgreSQL**
3. Fill in:
   - **Name:** sprint1-database
   - **Database:** sprint1db
   - **User:** sprint1user
   - **Region:** Choose closest to you
   - **Plan:** Free
4. Click **Create Database**
5. Wait for database to be created
6. Copy the **Internal Database URL** (starts with `postgresql://`)

#### Create Web Service

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Fill in:
   - **Name:** sprint1-backend
   - **Region:** Same as database
   - **Branch:** main
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   - `DATABASE_URL`: Paste the Internal Database URL from your PostgreSQL database
   - `NODE_ENV`: production
5. Click **Create Web Service**

#### Initialize Database

After deployment:
1. Go to your Web Service in Render
2. Click on **Shell** tab
3. Run:
```bash
npm run init-db
```

This will create all tables and insert sample data.

### Step 4: Test Your API

Your API will be available at: `https://sprint1-backend-xxxx.onrender.com`

Test endpoints:
- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/tasks` - Get all tasks
- `GET /api/users` - Get all users
- `GET /api/categories` - Get all categories

## API Documentation

### Base URL
- **Local:** `http://localhost:3000`
- **Production:** `https://your-app-name.onrender.com`

### Endpoints

#### Tasks
```
GET    /api/tasks              - Get all tasks
GET    /api/tasks/stats        - Get task statistics
GET    /api/tasks/:id          - Get specific task
POST   /api/tasks              - Create new task
PUT    /api/tasks/:id          - Update task
DELETE /api/tasks/:id          - Delete task
```

#### Users
```
GET    /api/users              - Get all users
GET    /api/users/:id          - Get specific user
GET    /api/users/:id/tasks    - Get user with tasks
POST   /api/users              - Create new user
PUT    /api/users/:id          - Update user
DELETE /api/users/:id          - Delete user
```

#### Categories
```
GET    /api/categories         - Get all categories
GET    /api/categories/counts  - Get categories with task counts
GET    /api/categories/:id     - Get specific category
POST   /api/categories         - Create new category
PUT    /api/categories/:id     - Update category
DELETE /api/categories/:id     - Delete category
```

## Testing with cURL

### Create a new user:
```bash
curl -X POST https://your-app.onrender.com/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com"}'
```

### Get all tasks:
```bash
curl https://your-app.onrender.com/api/tasks
```

### Create a new task:
```bash
curl -X POST https://your-app.onrender.com/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "status": "pending",
    "priority": "high",
    "user_id": 1,
    "category_id": 1,
    "due_date": "2026-02-15"
  }'
```

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` environment variable is set correctly
- Ensure you're using the **Internal Database URL** from Render
- Check database is in the same region as web service

### Build Failures
- Check Node version compatibility (requires Node 18+)
- Verify all dependencies are in `package.json`
- Check build logs in Render dashboard

### Application Crashes
- Check application logs in Render dashboard
- Verify environment variables are set
- Ensure database tables are created (`npm run init-db`)

## Sprint Review Checklist

- [ ] Code pushed to GitHub with regular commits
- [ ] Application deployed to Render
- [ ] PostgreSQL database created and connected
- [ ] Database tables initialized with sample data
- [ ] All API endpoints tested and working
- [ ] Health check endpoint returning 200 OK
- [ ] README.md includes deployment URL
- [ ] Can demonstrate CRUD operations live

## Submission

1. Submit your **GitHub repository URL**
2. Submit your **Live Render URL**
3. Be ready to demo during class "Dev Day"
4. Be prepared to answer technical questions about:
   - How Express routing works
   - Where database configuration is defined
   - How controllers handle requests
   - What middleware is being used

---
