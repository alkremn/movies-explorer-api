const router = require('express').Router();
const { celebrate, Segments, Joi } = require('celebrate');

const auth = require('../middlewares/auth');
const { getUser, updateUser } = require('../controllers/users');

router.get('/me', auth, getUser);
router.patch(
  '/me',
  auth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email().messages({
        'string.empty': 'Имеил не может быть пустым',
        'string.email': 'Невалидный имеил',
      }),
      name: Joi.string().required().min(2).max(30)
        .messages({
          'string.empty': 'Имя не может быть пустым',
          'string.min': 'Имя менее 2 символов',
          'string.max': 'Имя более 30 символов',
        }),
    }),
  }),
  updateUser,
);

module.exports = router;
