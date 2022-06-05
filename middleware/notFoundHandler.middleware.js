const NotFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);

  res.status(404);

  next(error);
};

export default NotFoundHandler;
