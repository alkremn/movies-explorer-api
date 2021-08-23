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
      email: Joi.string().required().email(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
);

module.exports = router;
