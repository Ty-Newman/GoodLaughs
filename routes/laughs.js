const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { Sequelize } = require('../db/models');
const { csrfProtection, asyncHandler, handleValidationErrors, loginUserCheck } = require('../utils');
const { check, body, validationResult } = require('express-validator');
const Op = Sequelize.Op;

const validateLaugh = [
  check('laughBody')
    .exists({ checkFalsy: true })
    .withMessage("Please provide a joke."),
  check('lols')
    .isFloat({ min: 1, max: 5})
    .withMessage("Please provide a number between 1 and 5.")
]

const laughNotFoundError = (id) => {
  const err = Error(`Laugh you referred could not be found.`)
  err.title = "Laugh not found";
  err.status = 404;
  return err;
}

router.get('/', csrfProtection, asyncHandler(async (req, res, next) => {

  loginUserCheck(req, res, next);

  res.render('laughs', {
    title: 'Add a Laugh',
    body: '',
    errors: '', 
    csrfToken: req.csrfToken(),
  });
}));

router.post('/', csrfProtection, validateLaugh, handleValidationErrors, asyncHandler(async (req, res) => {
  const { laughBody, bows, lols, reviewBody } = req.body;
  const userId = req.session.user.id;
  const userIdInt = parseInt(userId);
  const bowsBoolean = (bows === 'on') ? true : false;
  const lolsInt = parseInt(lols);

  const validateErrors = validationResult(req);

  if (validateErrors.isEmpty()) {
    await db.Laugh.create({ body: laughBody, userId });
    const savedLaugh = await db.Laugh.findOne({
      where: {
        [Op.and] : [
          { userId: userIdInt },
          { body: laughBody }
        ]
      },
      include: User
    });

    const laughIdInt = parseInt(savedLaugh.id);

    await db.Rating.create({
      bows: bowsBoolean,
      lols: lolsInt,
      userId: userIdInt,
      laughId: laughIdInt
    });

    await db.Review.create({
      body: reviewBody,
      userId: userIdInt,
      laughId: laughIdInt
    });

    res.redirect('/');
  } else {
      const errors = validateErrors.array().map((error) => {
        return error.msg;
      });
      res.render('laughs', {
        title: 'Add a Laugh',
        body,
        errors,
        csrfToken: req.csrfToken(),
      });
  };
}))

// Retrieve a specific laugh
router.get('/:id(\\d+)', asyncHandler(async (req, res, next) => {
  const laughId = parseInt(req.params.id, 10);
  const laugh = await db.Laugh.findByPk(laughId);
  const laughUserId = laugh.userId;
  const url = '/laughs' + req.url;
  const errors = '';

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

  pugObject = { laugh, user, rating, review, url, errors }
  if (req.session.user.id == laughUserId) {
    res.render('laugh', pugObject);
  } else {
    res.render('reviews', pugObject);
  }
}))

// Update a specific laugh
router.put('/:id(\\d+)', validateLaugh, handleValidationErrors, asyncHandler(async (req, res, next) => {
  loginUserCheck(req, res, next);

  const laughId = parseInt(req.params.id, 10);
  const laugh = await db.Laugh.findByPk(laughId);

  const laughUserId = parseInt(laugh.userId);
  const loggedInUserId = parseInt(req.session.user.id);

  const review = await db.Review.findOne({
    where: {
      [Op.and] : [
        { userId: loggedInUserId },
        { laughId }
      ]
    }
  });

  const rating = await db.Rating.findOne({
    where: {
      [Op.and] : [
        { userId: loggedInUserId },
        { laughId }
      ]
    }
  });
  
  const { laughBody, bows, lols, reviewBody } = req.body
  if (laugh && laughUserId === loggedInUserId) {
    await laugh.update({ laughBody });
    await rating.update({ bows, lols });
    await review.update({ reviewBody });

  } else if (laugh) {
    await review.update({ reviewBody });
    await rating.update({ bows, lols });
  }
  else {
    next(laughNotFoundError(laughId));
  }
}))

// Delete a specific laugh
router.delete('/:id(\\d+)', asyncHandler(async (req, res, next) => {
  const laughId = parseInt(req.params.id, 10);
  const laugh = await db.Laugh.findByPk(laughId);
  console.log('hi')

  if (laugh) {
    await laugh.destroy();
    res.status(204).end();
  } else {
    next(laughNotFoundError(taskId));
  }
}))

// Retrieve a specific laugh if the logged in user did not make it
router.get('/:id(\\d+)/reviews', asyncHandler(async (req, res, next) => {
  const laughId = parseInt(req.params.id, 10);
  const laugh = await db.Laugh.findByPk(laughId);
  const laughUserId = laugh.userId;
  const url = '/laughs' + req.url;
  const errors = '';

  let userIdInt = '';
  if (req.session.user.id == laughUserId) {
    userIdInt = parseInt(laughUserId);
  } else {
    userIdInt = parseInt(req.session.user.id);
  }
  
  const laughCreatorUser = await db.User.findOne({
    where: { id: laughUserId }
  });
  const user = laughCreatorUser;

  let reviews = await db.Review.findAll({
    where: { laughId },
    include: db.User
  });
  let noReviews = {};

  if (reviews.length === 0) {
    noReviews = 
      { user: 
        { 
          username: laughCreatorUser.username 
        },
        laugh: 
        { 
          body: laugh.body 
        }
      };
  }

  // let rating = await db.Rating.findOne({
  //   where: {
  //     [Op.and] : [
  //       { userId: userIdInt },
  //       { laughId }
  //     ]
  //   }
  // });

  // let review = await db.Review.findOne(
  //   {
  //     where: {
  //       [Op.and] : [
  //         { userId: userIdInt },
  //         { laughId }
  //       ]
  //     }
  //   }
  // );

  //   if (!reviews) {
  //   const laughCreatorUsername = await db.User.findOne({
  //     where: { id: laughUserId }
  //   });
  //   reviews = [
  //     { user: 
  //       { username: laughCreatorUsername }
  //     },
  //     { laugh: 
  //       { body: laugh.body }
  //     }
  //   ];
  // }

  console.log(noReviews)
  pugObject = { laugh, reviews, noReviews, user, url, errors }
  res.render('reviews', pugObject);
}))

router.post('/:id(\\d+)/reviews', asyncHandler(async (req, res, next) => {
  const laughId = parseInt(req.params.id, 10);
  const laugh = await db.Laugh.findByPk(laughId);
  const laughUserId = parseInt(laugh.userId);
  const userIdInt = parseInt(req.session.user.id);
  const { reviewBody } = req.body;
  const url = '/laughs' + req.url;
  const errors = '';

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

  if (review) {
    review.body = reviewBody;
    await review.save();
  } else {
    console.log(reviewBody, req.session.user.id, req.params.id)
    await db.Review.create({ body: reviewBody, userId: req.session.user.id, laughId: req.params.id });
  }

  let reviews = await db.Review.findAll({
    where: { laughId },
    include: db.User
  });

  const laughCreatorUser = await db.User.findOne({
    where: { id: laughUserId }
  });
  const user = laughCreatorUser;
  pugObject = { laugh, reviews, user, url, errors }
  res.render('reviews', pugObject);
}))

module.exports = router;
