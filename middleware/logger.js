function loggingMiddleware(req, res, next) {
    console.log('Logging....'); // Log a message (or req.body if needed)
    next();
  }
  
  module.exports = loggingMiddleware;
  