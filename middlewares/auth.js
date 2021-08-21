const jwt = require('jsonwebtoken');
const { AUTH_ERROR } = require('../error_codes');

const SECRET_KEY =
  process.env.NODE_ENV !== 'production'
    ? 'Some_secret_key'
    : process.env.JWT_SECRET_KEY;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const error = new Error('Authorization required');
    error.statusCode = AUTH_ERROR;
    next(error);
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    console.log(err);
    err.statusCode = AUTH_ERROR;
    next(err);
    return;
  }

  req.user = payload;

  next();
};
