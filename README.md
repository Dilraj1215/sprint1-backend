# Sprint 1 - Backend API

A RESTful API built with Node.js, Express, and PostgreSQL for managing a Task Management system.

## Features

- RESTful API endpoints for full CRUD operations
- JWT authentication (register & login)
- bcrypt password hashing — passwords never stored in plain text
- Protected routes via JWT middleware
- PostgreSQL database integration with foreign key relationships
- Environment-based configuration
- Error handling and validation
- CORS enabled for frontend integration
- Security headers with Helmet
- Request logging with Morgan
- Deployed to Render

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **pg** - PostgreSQL client
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **cors** - Cross-Origin Resource Sharing
- **helmet** - Security headers
- **morgan** - HTTP request logger

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your database credentials:
```
PORT=3000
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
```

4. Initialize the database:
```bash
npm run init-db
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication (Public — no token required)

- `POST /api/auth/register` - Register a new user (hashes password with bcrypt, returns JWT)
- `POST /api/auth/login` - Login with email & password (returns JWT)

> All routes below require `Authorization: Bearer <token>` header.

### Tasks (Protected)

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/stats` - Get task statistics
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Users (Protected)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `GET /api/users/:id/tasks` - Get user with their tasks
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Categories (Protected)

- `GET /api/categories` - Get all categories
- `GET /api/categories/counts` - Get categories with task counts
- `GET /api/categories/:id` - Get a specific category
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

## Database Schema

### Users Table
- id (SERIAL PRIMARY KEY)
- username (VARCHAR, UNIQUE)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR) — bcrypt hashed, never plain text
- created_at (TIMESTAMP)

### Categories Table
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- description (TEXT)
- created_at (TIMESTAMP)

### Tasks Table
- id (SERIAL PRIMARY KEY)
- title (VARCHAR)
- description (TEXT)
- status (VARCHAR)
- priority (VARCHAR)
- user_id (INTEGER, FOREIGN KEY)
- category_id (INTEGER, FOREIGN KEY)
- due_date (DATE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Deployment to Render

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Add a PostgreSQL database
5. Set environment variables:
   - `DATABASE_URL` (automatically set by Render PostgreSQL)
   - `NODE_ENV=production`
6. Deploy!

## Project Structure

```
sprint1-backend/
├── config/
│   └── database.js          # Database configuration (PostgreSQL pool)
├── controllers/
│   ├── authController.js    # Register & login logic
│   ├── taskController.js
│   ├── userController.js
│   └── categoryController.js
├── models/
│   ├── Task.js
│   ├── User.js
│   └── Category.js
├── routes/
│   ├── authRoutes.js        # Public: POST /register, POST /login
│   ├── taskRoutes.js
│   ├── userRoutes.js
│   └── categoryRoutes.js
├── middleware/
│   ├── authMiddleware.js    # JWT verification (protects private routes)
│   └── errorHandler.js     # Centralized error handling
├── scripts/
│   └── initDatabase.js     # Database initialization script
├── .gitignore
├── server.js               # Main application entry point
├── package.json
└── README.md
```

## Author

Dilraj Singh

## Course Information

PROG2500-26W-Sec1 - Open-Source Full Stack Development
Sprint 1 Submission
