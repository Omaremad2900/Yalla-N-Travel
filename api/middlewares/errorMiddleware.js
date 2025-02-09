// errorMiddleware.js
const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      //stack trace
      error: error.stack
    });
  };
  
  export default errorHandler;
  