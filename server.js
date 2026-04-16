require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers — relax CSP so the React SPA can load its own scripts/styles
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// CORS — allow all origins so the frontend can reach the API regardless of host
app.use(cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the built React frontend as static files
const frontendDist = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(frontendDist));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root info endpoint (only reached if no index.html is present)
app.get('/', (req, res) => {
  res.json({
    message: 'TaskFlow API',
    version: '1.0.0',
    author: 'Dilraj Singh',
    endpoints: {
      auth: '/api/auth (register, login)',
      tasks: '/api/tasks (JWT protected)',
      users: '/api/users (JWT protected)',
      categories: '/api/categories (JWT protected)'
    }
  });
});

// Catch-all: for any non-API route send the React app so client-side routing works
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
    if (err) {
      // Frontend not built yet — just send a plain message
      res.status(200).send('API is running. Build the frontend to serve the UI.');
    }
  });
});

// 404 for unmatched API routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Centralised error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API: http://localhost:${PORT}/api`);
});

module.exports = app;
