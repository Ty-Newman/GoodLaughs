const csrf = require('csurf');
const { validationResult } = require('express-validator')

const csrfProtection = csrf({ cookie: true });

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => error.msg);

    const urlInSections = req.originalUrl.split('/');
    const endOfUrl = urlInSections[urlInSections.length - 1];

    const err = Error("Errors");
    err.errors = errors;
    err.status = 400;

    res.render(endOfUrl, {
      title: err.title,
      // csrfToken: req.csrfToken(),
      errors: err.errors
    });

    return next(err);
  }
  next();
};

const loginUserCheck = (req, res, next) => {
  if (!req.session.user) {
    const err = new Error('User not logged in')
    const message = "No user logged in. Please log in at the login page, or signup if you do not have an account."
    err.message = req.app.get('env') === 'development' ? message : {};
    next(err);
  }
};

module.exports = {
    csrfProtection,
    asyncHandler,
    handleValidationErrors,
    loginUserCheck
};
