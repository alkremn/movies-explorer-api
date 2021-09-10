const jwt = require('jsonwebtoken');
const { AUTH_ERROR, FORBIDDEN_ERROR } = require('../error_codes');
const { DEV_SECRET_KEY } = require('../configs/config');

const SECRET_KEY = process.env.NODE_ENV !== 'production'
  ? DEV_SECRET_KEY
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
    const error = new Error('Invalid Token');
    error.statusCode = FORBIDDEN_ERROR;
    next(error);
    return;
  }

  req.user = payload;

  next();
};
