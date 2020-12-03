var express = require('express');
var router = express.Router();
const db = require('../db/models');
const bcrypt = require('bcryptjs');
const { csrfProtection, asyncHandler, handleValidationErrors } = require('../utils');
const { loginUser } = require('../auth');
const { check, body, validationResult } = require('express-validator');
const { Sequelize } = require('../db/models');
const Op = Sequelize.Op;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', csrfProtection, (req, res) => {
  res.render('login', {
    title: 'Login',
    csrfToken: req.csrfToken(),
    errors: ""
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
    if (user !== null || user === undefined) {
      const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
      if (passwordMatch) {
        req.session.user = {
          username: user.username,
          id: user.id,
        };
        console.log(req.session)
        req.session.save(() => {
          res.redirect('/');
        })
      }
    }
    errors.push('Login failed for the provided username and password')
  } else {
    errors = validatorErrors.array().map((error) => error.msg)
    res.render('login', {
      title: 'Login',
      csrfToken: req.csrfToken(),
      errors,
    });
  }
}));

router.get('/signup', csrfProtection, (req, res) => {
  res.render('signup', {
    title: 'User Sign Up',
    csrfToken: req.csrfToken(),
    errors: '',
  });
});

const validateSignup = [
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Please provide your login username."),
  check("username")
    .isLength({ max: 30 })
    .withMessage("Your username cannot be longer than 30 characters."),
  check("email")
    .isLength({ max: 100 })
    .withMessage("Your email address cannot be longer than 100 characters."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a different password."),
  check("confirmPass")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a different confirmed password."),
  check("password")
    .custom((value, { req }) => {
      if (value !== req.body.confirmPass) {
        throw new Error("Password and Confirm Password values do not match.");
      } else {
        return value;
      }})
];

router.post('/signup', csrfProtection, validateSignup, handleValidationErrors, asyncHandler(async (req, res, next) => {
  console.log(req.body, "test")
  const {
    username,
    email,
    password
  } = req.body;

  let errors = [];

  const validatorErrors = validationResult(req);
  if (validatorErrors.isEmpty()) {
    const user = db.User.build({
      username,
      email,
    });

    // check if user already in database
    const existingUser = await db.User.findOne({ where: { [Op.or]: [
      { username },
      { email }
    ]}});

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.hashedPassword = hashedPassword;
      await user.save();

      // log the user in
      req.session.user = {
        username: user.username,
        id: user.id,
      };
      req.session.save(() => {
        res.redirect('/');
      })
    }
    errors.push('Signup failed for the provided username and email')
    console.log(errors)
  } else {
    errors = validatorErrors.array().map((error) => error.msg)
  }

  console.log(errors);
  res.render('signup', {
    title: 'Signup',
    csrfToken: req.csrfToken(),
    errors,
  });
}));

// router.get('/laughs', csrfProtection, (req, res) => {
//   const laugh = db.Laugh.build();
//   res.render('laughs', {
//     title: 'Add a Laugh',
//     body: '',
//     errors: '',
//     csrfToken: req.csrfToken(),
//   });
// })

// router.post('/laughs', csrfProtection, asyncHandler(async (req, res) => {
//   const { body } = req.body;

//   const laugh = db.Laugh.build({ body });

//   const validateErrors = validationResult(req);

//   if (validateErrors.isEmpty()) {
//     await laugh.save(() => {
//       res.redirect('/')});
//   } else {
//     const errors = validateErrors.array().map((error) => {
//       return error.msg
//     })
//     console.log(errors)
//     res.render('laughs', {
//       title: 'Add a Laugh',
//       body,
//       errors,
//       csrfToken: req.csrfToken(),
//     });
//   };
// }))

module.exports = router;
