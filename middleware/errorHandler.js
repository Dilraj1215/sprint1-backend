// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // PostgreSQL unique constraint violation
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry. This record already exists.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // PostgreSQL foreign key constraint violation
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Invalid reference. The related record does not exist.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // PostgreSQL not null constraint violation
  if (err.code === '23502') {
    return res.status(400).json({
      success: false,
      message: 'Missing required field.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Invalid input syntax
  if (err.code === '22P02') {
    return res.status(400).json({
      success: false,
      message: 'Invalid input format.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
