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
  const userId = req.session.user.id;
  const userIdInt = parseInt(userId);
  const rating = await db.Rating.findOne(
    {
      where: {
        [Op.and] : [
          { userId: userIdInt },
          { laughId }
        ]
      },
      include: User
    }
  );
  const review = await db.Review.findOne(
    {
      where: {
        [Op.and] : [
          { userId: userIdInt },
          { laughId }
        ]
      }
    }
  );
  res.render('laugh', { laugh, rating, review });
}))

// Update a specific laugh
router.put('/:id(\\d+)', validateLaugh, handleValidationErrors, asyncHandler(async (req, res, next) => {
  loginUserCheck(req, res, next);

  const laughId = parseInt(req.params.id, 10);
  const laugh = await db.Laugh.findByPk(laughId);

  if (laugh) {
    await laugh.update({ body: req.body.body })
  } else {
    next(laughNotFoundError(taskId));
  }
}))

// Delete a specific laugh
<<<<<<< Updated upstream
router.delete('/:id(\\d+)', validateLaugh, handleValidationErrors, asyncHandler(async (req, res, next) => {
  loginUserCheck(req, res, next);

=======
router.delete('/:id(\\d+)', asyncHandler(async (req, res, next) => {
>>>>>>> Stashed changes
  const laughId = parseInt(req.params.id, 10);
  const laugh = await db.Laugh.findByPk(laughId);

  if (laugh) {
    await laugh.destroy();
    res.status(204).end();
  } else {
    next(laughNotFoundError(taskId));
  }
}))

module.exports = router;
