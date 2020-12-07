const csrf = require('csurf');
const { validationResult } = require('express-validator')

const csrfProtection = csrf({ cookie: true });

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

const db = require('./db/models');
const { Sequelize } = require('./db/models');
const Op = Sequelize.Op;
const laughErrors = async (req) => {
  const laughId = parseInt(req.params.id, 10);
  const laugh = await db.Laugh.findByPk(laughId);
  const laughUserId = laugh.userId;
  const url = '/laughs' + req.url;

  if (parseInt(laughUserId) !== parseInt(req.session.user.id)) {
    const err = new Error('This user cannot edit this laugh. Please login as the user who created this laugh or visit another laugh. Thank you very much')
    next(err);
  }

  let userIdInt = '';
  if (req.session.user.id == laughUserId) {
    userIdInt = parseInt(laughUserId);
  } else {
    userIdInt = parseInt(req.session.user.id);
  }

  const user = await db.User.findOne({
    where: { id: userIdInt }
  });

  let rating = await db.Rating.findOne({
    where: {
      [Op.and] : [
        { userId: userIdInt },
        { laughId }
      ]
    }
  });

  let review = await db.Review.findOne(
    {
      where: {
        [Op.and] : [
          { userId: userIdInt },
          { laughId }
        ]
      }
    }
  );

  const pugList = [laugh, user, rating, review, url];

  res.render('laugh', {
    title: err.title,
    // csrfToken: req.csrfToken(),
    errors: err.errors,
    laugh: pugList[0],
    user: pugList[1],
    rating: pugList[2],
    review: pugList[3],
    url: pugList[4]
  });
}

const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => error.msg);

    const urlInSections = req.originalUrl.split('/');
    const endOfUrl = urlInSections[urlInSections.length - 1];

    const err = Error("Errors");
    err.errors = errors;
    err.status = 400;

    if (req.csrfToken === undefined) {
      return laughErrors(req);   
    } else {
      res.render(endOfUrl, {
        title: err.title,
        csrfToken: req.csrfToken(),
        errors: err.errors
      });
    }
    return next(err);
  }
  next();
};

const loginUserCheck = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/users/login')
  }
  next()
};

module.exports = {
    csrfProtection,
    asyncHandler,
    handleValidationErrors,
    loginUserCheck
};
