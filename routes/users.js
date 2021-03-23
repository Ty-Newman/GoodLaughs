var express = require("express");
var router = express.Router();
const db = require("../db/models");
const bcrypt = require("bcryptjs");
const {
  csrfProtection,
  asyncHandler,
  handleValidationErrors,
  loginUserCheck,
} = require("../utils");
const { loginUser, logoutUser } = require("../auth");
const { check, validationResult } = require("express-validator");
const { Sequelize } = require("../db/models");
const Op = Sequelize.Op;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.redirect("/");
});

router.get(
  "/demo",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const user = await db.User.findOne({ where: { username: "Demo" } });

    req.session.user = {
      username: user.username,
      id: user.id,
      csrfToken: req.csrfToken(),
    };
    req.session.save();

    return res.redirect("/");
  })
);

router.get("/login", csrfProtection, (req, res) => {
  const errors = [];

  if (req.session.user) {
    errors.push(`You are currently logged in as: ${req.session.user.username}`);
    res.redirect("/");
  }

  res.render("login", {
    title: "Login",
    csrfToken: req.csrfToken(),
    errors,
    user: req.session.user,
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
    .withMessage("Please provide your password."),
];

router.post(
  "/login",
  csrfProtection,
  validateLogin,
  handleValidationErrors,
  asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    let errors = [];

    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
      const user = await db.User.findOne({ where: { username } });
      if (!user) {
        errors.push("Invalid login ID. Please try again.");
        return res.render("login", {
          title: "Login",
          csrfToken: req.csrfToken(),
          errors,
        });
      }

      const passwordMatch = await bcrypt.compare(
        password,
        user.hashedPassword.toString()
      );
      if (passwordMatch) {
        req.session.user = {
          username: user.username,
          id: user.id,
          csrfToken: req.csrfToken(),
        };
        req.session.save();
        return res.redirect("/");
      } else {
        errors.push("Invalid password. Please try again.");
      }
    } else {
      errors = validatorErrors.array().map((error) => error.msg);
    }
    if (errors) {
      res.render("login", {
        title: "Login",
        csrfToken: req.csrfToken(),
        errors,
      });
    }
  })
);

router.get("/signup", csrfProtection, (req, res) => {
  const errors = [];

  if (req.session.user) {
    errors.push(`You are currently logged in as: ${req.session.user.username}`);
  }

  res.render("signup", {
    title: "User Sign Up",
    csrfToken: req.csrfToken(),
    errors,
    user: req.session.user,
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
    .exists({ checkFalsy: true })
    .withMessage("Please provide an email address."),
  check("email")
    .isLength({ max: 100 })
    .withMessage("Your email address cannot be longer than 100 characters."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide your password."),
  check("confirmPass")
    .exists({ checkFalsy: true })
    .withMessage("Please provide your password again."),
  check("password").custom((value, { req }) => {
    if (value !== req.body.confirmPass) {
      throw new Error("Your passwords do not match.");
    } else {
      return value;
    }
  }),
];

router.post(
  "/signup",
  csrfProtection,
  validateSignup,
  handleValidationErrors,
  asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    let errors = [];

    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
      const user = await db.User.build({
        username,
        email,
      });

      const existingUser = await db.User.findOne({
        where: { [Op.or]: [{ username }, { email }] },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.hashedPassword = hashedPassword;
        await user.save();

        req.session.user = {
          username: user.username,
          id: user.id,
        };
        return req.session.save((err) => {
          if (err) return next(err);
          res.redirect("/");
        });
      }
      errors.push("Signup failed for the provided username and email");
    } else {
      errors = validatorErrors.array().map((error) => error.msg);
    }

    res.render("signup", {
      title: "Signup",
      csrfToken: req.csrfToken(),
      errors,
    });
  })
);

router.post("/logout", (req, res) => {
  //logoutUser(req, res);
  req.session.user = null;
  req.session.save(() => {
    res.redirect("/");
  });
});

module.exports = router;
