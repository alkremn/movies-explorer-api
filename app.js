const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const {
  celebrate,
  Joi,
  errors,
  Segments,
  isCelebrateError,
} = require('celebrate');

const { login, createUser } = require('./controllers/users');

require('dotenv').config();

const app = express();

// database connection
mongoose.connect('mongodb://localhost/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

// middleware
app.use(helmet());
app.use(express.json());

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

const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
