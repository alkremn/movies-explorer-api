const bcrypt = require('bcryptjs');
const User = require('../models/user');

const {
  SERVER_ERROR,
  CONFLICT_ERROR,
  INVALID_DATA_ERROR,
} = require('../error_codes');

module.exports.login = (req, res) => {
  console.log(req);
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
        if (!user) {
          const error = new Error('Internal Server Error');
          error.status = SERVER_ERROR;
          throw error;
        }
        res.send({
          data: {
            name: user.name,
            email: user.email,
          },
        });
      })
      .catch((err) => {
        if (err.name === 'MongoError' && err.code === 11000) {
          const error = new Error(err.message);
          error.statusCode = CONFLICT_ERROR;
          next(error);
        } else if (err.name === 'VaidationError') {
          const error = new Error(err.message);
          error.statusCode = INVALID_DATA_ERROR;
          next(error);
        } else {
          console.log(err);
          const error = new Error('Internal Server error');
          error.statusCode = SERVER_ERROR;
          next(error);
        }
      });
  });
};
