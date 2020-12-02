const csrf = require('csurf');
const { check , validationResult} = require('express-validator')


const csrfProtection = csrf({ cookie: true });

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);


// ./routes/users Validation & Error Handling
const validateLogin = [
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Please provide your login username."),
  check("username")
    .isLength({ max: 30 })
    .withMessage("Your username cannot be longer than 30 characters."),
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Please provide your email address."),
  check("email")
    .isLength({ max: 30 })
    .withMessage("Your email address cannot be longer than 100 characters."),
]

const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";

    // res.render(req.originalUrl, {
    //     title: 'Error',
    //     errors,
    //     csrfToken: req.csrfToken()
    // });

    return next(err);
  }
  next();
};

module.exports = {
    csrfProtection,
    asyncHandler,
    validateLogin,
    handleValidationErrors
};
