const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

require('dotenv').config();

const {
  celebrate,
  Joi,
  errors,
  Segments,
  isCelebrateError,
} = require('celebrate');

const {
  INVALID_DATA_ERROR,
  SERVER_ERROR,
  NOT_FOUND_ERROR,
} = require('./error_codes');

const { login, createUser } = require('./controllers/users');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;

const app = express();

app.use(requestLogger);

// database connection
mongoose.connect('mongodb://localhost/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

// middleware
app.use(cors);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errors());

// routes
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.post(
  '/signin',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);

app.post(
  '/signup',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string(),
    }),
  }),
  createUser
);

app.use(errorLogger);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.statusCode = NOT_FOUND_ERROR;
  next(error);
});

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else if (isCelebrateError(err)) {
    res.status(INVALID_DATA_ERROR).send({ message: err.details.get('body') });
  } else {
    res.status(SERVER_ERROR).send({ message: 'Internal Server Error' });
  }
  next();
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
