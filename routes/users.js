var express = require('express');
var router = express.Router();
const db = require('../db/models');
const bcrypt = require('bcryptjs');
const { csrfProtection, asyncHandler, handleValidationErrors } = require('../utils');
const { loginUser } = require('../auth');
const { check, validationResult } = require('express-validator');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', csrfProtection, (req, res) => {
  res.render('login', {
    title: 'Login',
    csrfToken: req.csrfToken()
  });
});

const validateLogin = [
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Please provide your login username."),
  check("username")
    .isLength({ max: 30 })
    .withMessage("Your username cannot be longer than 30 characters."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide your email address."),
]

router.post('/login', csrfProtection, validateLogin, handleValidationErrors, asyncHandler(async (req, res, next) => {
  const {
    username,
    password
  } = req.body;

  let errors = [];

  const validatorErrors = validationResult(req);
  if (validatorErrors.isEmpty()) {
    const user = await db.User.findOne({ where: { username } });
    if (user !== null) {
      const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
      if (passwordMatch) {
        loginUser(req, res, user);
        return res.redirect('/');
      }
    }
    errors.push('Login failed for the provided username and password')
  } else {
    errors = validatorErrors.array().map((error) => error.msg)
  }

  res.render('login', {
    title: 'Login',
    csrfToken: req.csrfToken(),
    errors,
  });
}));

router.get('/signup', csrfProtection, (req, res) => {
  res.render('signup', {
    title: 'User Sign Up',
    csrfToken: req.csrfToken()
  });
});

router.post('/signup', csrfProtection, validateLogin, handleValidationErrors, asyncHandler(async (req, res, next) => {
  console.log(req.body, "test")
  const {
    username,
    email,
    password
  } = req.body;

  const user = db.User.build({
    username,
    email,
  })

  const hashedPassword = await bcrypt.hash(password, 10);
  user.hashedPassword = hashedPassword;
  await user.save();
  req.session.user = user;
  req.session.save(() => {
    res.redirect('/');
  })

}));

module.exports = router;
