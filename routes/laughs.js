const express = require('express');
const router = express();
const db = require('../db/models');
const { csrfProtection, asyncHandler, handleValidationErrors } = require('../utils');
const { check, validationResult } = require('express-validator');

const validateLaugh = [
  check("body")
    .exists({ checkFalsy: true })
    .withMessage("Please enter your laugh")
    .custom((value) => {
      return db.Laugh.findOne({ where: { body: value } })
      .then((laugh) => {
        if (laugh) {
          return Promise.reject('The same laugh has already been shared by another user!')
        }
      })
    })
]

const laughNotFoundError = (id) => {
  const err = Error(`Laugh you referred could not be found.`)
  err.title = "Laugh not found";
  err.status = 404;
  return err;
}

router.get('/', csrfProtection, (req, res, next) => {
  const laughs = await db.Laugh.findAll();
  res.render('laughs', {
    title: 'Laughs',
    csrfToken: req.csrfToken(),
    laughs,
  })
});

router.post('/', csrfProtection, handleValidationErrors, asyncHandler(async (req, res, next) => {
  const { body } = req.body
  const laugh = await db.Laugh.create({ body })
  req.session.save(() => {
    res.redirect('/laughs')
  })
  res.render('laughs', {
    title: "Post a new laugh"
  })
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
    await laugh.update({ body: req.body.body });
    res.redirect('/laughs');
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
    res.redirect('/laughs');
  } else {
    next(laughNotFoundError(taskId));
  }
}))

module.exports = router;
