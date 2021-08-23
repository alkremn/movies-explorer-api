const { isCelebrateError } = require('celebrate');
const {
  NOT_FOUND_ERROR,
  INVALID_DATA_ERROR,
  SERVER_ERROR,
} = require('../error_codes');

module.exports.notFound = (req, res, next) => {
  const error = new Error('Not Found');
  error.statusCode = NOT_FOUND_ERROR;
  next(error);
};

module.exports.errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ error: err.message });
  } else if (isCelebrateError(err)) {
    res.status(INVALID_DATA_ERROR).send({
      error: 'Bad request',
    });
  } else {
    res.status(SERVER_ERROR).send({ error: 'Internal Server Error' });
  }
  next();
};
