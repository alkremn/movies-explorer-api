const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const auth = require('../middlewares/auth');

const { login, createUser } = require('../controllers/users');
const { notFound } = require('../middlewares/errors');

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.post(
  '/signin',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email().messages({
        'string.empty': 'Имеил не может быть пустым',
        'string.email': 'Невалидный имеил',
      }),
      password: Joi.string().required().min(8).messages({
        'string.empty': 'Пароль не может быть пустым',
        'string.min': 'Пароль менее 8 символов',
      }),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email().messages({
        'string.empty': 'Имеил не может быть пустым',
        'string.email': 'Невалидный имеил',
      }),
      password: Joi.string().required().min(8).messages({
        'string.empty': 'Пароль не может быть пустым',
        'string.min': 'Пароль менее 8 символов',
      }),
      name: Joi.string().required().min(2).max(30)
        .messages({
          'string.empty': 'Имя не может быть пустым',
          'string.min': 'Имя менее 2 символов',
          'string.max': 'Имя более 30 символов',
        }),
    }),
  }),
  createUser,
);

router.use(auth, notFound);

module.exports = router;
