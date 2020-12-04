const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { Sequelize } = require('../db/models');
const { csrfProtection, asyncHandler, handleValidationErrors} = require('../utils');
const { check, body, validationResult } = require('express-validator');

const validateReview = [
  check('reviewBody')
    .exists({ checkFalsy: true })
    .withMessage("Please provide your review."),
  check('reviewBody')
    .isLength({ max: 200 })
    .withMessage("Your review cannot be longer than 200 characters.")
]

const laughNotFoundError = (id) => {
  const err = Error('Laugh you referred could not be found.');
  err.title = "Laugh not found";
  err.status = 404;
  return err;
}

const reviewNotFoundError = (id) => {
  const err = Error('Review you referred could not be found.');
  err.title = "Review not found";
  err.status = 404;
  return err;
}

router.get('/:id(\\d+)', csrfProtection, asyncHandler(async (req, res, next) => {
  const laughId = parseInt(req.params.id, 10);
  const laugh = await db.Laugh.findByPk(laughId);

  if (laugh) {
    res.render('reviews', {
      title: 'Add a Review',
      body: '',
      errors: '',
      csrfToken: req.csrfToken(),
    })
  } else {
    next(laughNotFoundError(laughId));
  }
}))

router.post('/:id(\\d+)', csrfProtection, validateReview, handleValidationErrors, asyncHandler(async (req, res, next) => {
  const { reviewBody } = req.body;
  const userId = parseInt(req.session.user.id)
  const laughId = parseInt(req.params.id, 10);
  const laugh = await db.Laugh.findByPk(laughId);

  if (laugh) {
    const validateErrors = validationResult(req);

    if (validateErrors.insEmpty()) {
      await db.Review.create({
        body: reviewBody,
        userId: userId,
        laughId: laughId,
      });

      res.redirect('/');
    } else {
      const errors = validateErrors.array().map((error) => {
        res.render('reviews', {
          title: 'Add a new Review',
          body,
          errors,
          csrfToken: req.csrfToken(),
        })
      })
    }
  } else {
    next(laughNotFoundError(laughId));
  }

}))

router.delete('/:id(\\d+)', csrfProtection, handleValidationErrors, asyncHandler(async (req, res, next) => {
  const reviewId = parseInt(req.params.id, 10);
  const review = await db.Review.findByPk(reviewId);

  if (review) {
    await review.destroy();
    res.status(204).end();
  } else {
    next(reviewNotFoundError(reviewId))
  }
}))

module.exports = router;
