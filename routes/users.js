var express = require('express');
var router = express.Router();
const db = require('../db/models');
const bcrypt = require('bcryptjs');
const { csrfProtection, asyncHandler, validateLogin, handleValidationErrors } = require('../utils');

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

router.post('/login', csrfProtection, validateLogin, handleValidationErrors, asyncHandler(async (req, res, next) => {
  const {
    username,
    password
  } = req.body;

  const user = db.User.findOne({
    where: {
      username
    }
  });

  if (user !== null) {
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());

    if (passwordMatch) {
      return res.redirect('/');
    }
  }

  handleValidationErrors.push('Login failed for the combined email address and password');

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
  console.log(user)
  await user.save();
  console.log(user)

  req.session.user = user;

  req.session.save(() => {
    res.redirect('/');
  })

}));

module.exports = router;
