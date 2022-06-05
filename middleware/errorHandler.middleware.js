const ErrorHandler = (err, req, res, next) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(status).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default ErrorHandler;
