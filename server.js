require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Sprint 1 Backend API',
    version: '1.0.0',
    author: 'Dilraj Singh',
    endpoints: {
      auth: '/api/auth (register, login - Public)',
      tasks: '/api/tasks (Protected - requires Bearer token)',
      users: '/api/users (Protected - requires Bearer token)',
      categories: '/api/categories (Protected - requires Bearer token)'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);       // Public: register & login
app.use('/api/tasks', taskRoutes);      // Protected
app.use('/api/users', userRoutes);      // Protected
app.use('/api/categories', categoryRoutes); // Protected

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}` 
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 API available at: http://localhost:${PORT}`);
  console.log(`📚 Endpoints:`);
  console.log(`   - GET  /health`);
  console.log(`   - POST /api/auth/register  (public)`);
  console.log(`   - POST /api/auth/login     (public)`);
  console.log(`   - GET  /api/tasks          (protected)`);
  console.log(`   - GET  /api/users          (protected)`);
  console.log(`   - GET  /api/categories     (protected)`);
});

module.exports = app;
