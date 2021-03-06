import serializeError from 'serialize-error';
import log from '../log';

// Handle error 404
export function notFoundHandler(req, res, next) {
  const err = new Error('Page not found');
  err.status = 404;
  next(err);
}

// Handle all other errors
export function errorHandler(err, req, res, next) {
  log.error({
    url: req.url,
    error: serializeError(err)
  }, 'An error occurred serving route');

  // Delegate to the default error handler if
  // already started responding
  if (res.headersSent) {
    next(err);
  } else {
    const errorCode = err.status || 500;
    const errorMessage = err.message || 'Internal server error';

    res.status(errorCode);
    res.render('error', {
      title: `Error ${err.status}`,
      errorCode,
      errorMessage
    });
  }
}
