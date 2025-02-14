// middlewares/errorMiddleware.js

const errorMiddleware = (err, req, res, next) => {
    console.error('[Error Middleware]', err.stack);
  
    // If it's a validation error, it might come from express-validator
    if (err.errors) {
      return res.status(400).json({ errors: err.errors });
    }
  
    // Otherwise, return generic 500
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    res.status(statusCode).json({ message });
  };
  
  module.exports = errorMiddleware;
  