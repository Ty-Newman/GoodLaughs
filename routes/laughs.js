const express = require('express');
const router = express();
const db = require('../db/models');
const { Sequelize } = require('../db/models');
const { csrfProtection, asyncHandler, handleValidationErrors } = require('../utils');
const { check, body, validationResult } = require('express-validator');
const Op = Sequelize.Op;

const validateLaugh = [
  // TODO: Build validation for a laguh post
]

const laughNotFoundError = (id) => {
  const err = Error(`Laugh you referred could not be found.`)
  err.title = "Laugh not found";
  err.status = 404;
  return err;
}

router.get('/', csrfProtection, asyncHandler(async (req, res, next) => {
  const laugh = await db.Laugh.build();
  res.render('laughs', {
    title: 'Add a Laugh',
    body: '',
    errors: '',
    csrfToken: req.csrfToken(),
  });
}));

router.post('/', csrfProtection, asyncHandler(async (req, res) => {
  const { laughBody, bows, lols, reviewBody } = req.body;
  const userId = req.session.user.id;
  const userIdInt = parseInt(userId);
  const bowsBoolean = (bows === 'on') ? true : false;
  const lolsInt = parseInt(lols);

  const laugh = await db.Laugh.build({ body: laughBody, userId });
  
  const validateErrors = validationResult(req);

  if (validateErrors.isEmpty()) {
    await laugh.save();
    const savedLaugh = await db.Laugh.findOne({
      where: {
        [Op.and] : [
          { userId: userIdInt },
          { body: laughBody }
        ]
      }
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
      res.render('laughs', {
        title: 'Add a Laugh',
        body,
        errors,
        csrfToken: req.csrfToken(),
      });
      return error.msg
    })
  };
}))

// Retrieve a specific laugh
router.get('/:id(\\d+)', validateLaugh, handleValidationErrors, asyncHandler(async (req, res, next) => {
  const laughId = parseInt(req.params.id, 10);
  const laugh = await db.Laugh.findByPk(laughId);
  res.render('laughs', { laugh })
}))

// Update a specific laugh
router.put('/:id(\\d+)', validateLaugh, handleValidationErrors, asyncHandler(async (req, res, next) => {
  const laughId = parseInt(req.params.id, 10);
  const laugh = await db.Laugh.findByPk(laughId);

  if (laugh) {
    await laugh.update({ body: req.body.body })
  } else {
    next(laughNotFoundError(taskId));
  }
}))

// Delete a specific laugh
router.delete('/:id(\\d+)', validateLaugh, handleValidationErrors, asyncHandler(async (req, res, next) => {
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
