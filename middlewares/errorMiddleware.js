const errorMiddleware = (err, req, res, next) => {
    console.error('[Error Middleware]', err.stack);
  
    if (err.errors) {
      return res.status(400).json({ errors: err.errors });
    }
  
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    res.status(statusCode).json({ message });
  };
  
  module.exports = errorMiddleware;
  
