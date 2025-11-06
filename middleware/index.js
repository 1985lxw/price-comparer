import cors from 'cors';
import express from 'express';

/**
 * Registers global middleware on the Express app.
 */
export function registerMiddleware(app) {
  // Enable CORS so the frontend we can call the API.
  app.use(
    cors({
      origin(origin, callback) {
        const allowedOrigins = [
          'http://localhost:3000', 
          'http://127.0.0.1:5500', 
          'http://localhost:5500',
          'http://localhost:5173',  
        ];

        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
  );

  // Parse JSON request bodies
  app.use(express.json());
  // Parse URL-encoded form bodies
  app.use(express.urlencoded({ extended: true }));
  // Simple request logger (handy for debugging)
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});
}

// 404 handler
export function notFoundHandler(req, res, _next) {
  res.status(404).json({ error: 'Route not found' });
}

//Central error handler 
export function errorHandler(err, req, res, _next) {
  console.error('Unhandled error:', err);
  if (res.headersSent) {
    return;
  }
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal server error' });
}