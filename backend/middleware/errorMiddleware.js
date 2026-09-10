// Handles requests to routes that don't exist
const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
};

// Catches any errors thrown/passed in the app and sends a clean JSON response
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
