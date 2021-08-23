const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { DEV_SECRET_KEY } = require('../configs/config');

const SECRET_KEY = process.env.NODE_ENV !== 'production'
  ? DEV_SECRET_KEY
  : process.env.JWT_SECRET_KEY;

const {
  SERVER_ERROR,
  CONFLICT_ERROR,
  INVALID_DATA_ERROR,
  AUTH_ERROR,
  NOT_FOUND_ERROR,
} = require('../error_codes');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => res.send({
      token: jwt.sign({ _id: user._id }, SECRET_KEY, {
        expiresIn: '7d',
      }),
    }))
    .catch((err) => {
      const error = new Error(err.message);
      error.statusCode = AUTH_ERROR;
      next(error);
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      email,
      password: hash,
      name,
    })
      .then((user) => {
        res.send({
          data: {
            name: user.name,
            email: user.email,
          },
        });
      })
      .catch((err) => {
        if (err.name === 'MongoError' && err.code === 11000) {
          const error = new Error('This email is already registered');
          error.statusCode = CONFLICT_ERROR;
          next(error);
        } else if (err.name === 'VaidationError') {
          const error = new Error(err.message);
          error.statusCode = INVALID_DATA_ERROR;
          next(error);
        }
      });
  });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch((err) => {
      const error = new Error(err.message);
      error.statusCode = SERVER_ERROR;
      next(error);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = NOT_FOUND_ERROR;
        throw error;
      }
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        const error = new Error('This email is already registered');
        error.statusCode = CONFLICT_ERROR;
        next(error);
      }
    });
};
