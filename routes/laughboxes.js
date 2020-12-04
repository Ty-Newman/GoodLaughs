const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { csrfProtection, asyncHandler} = require('../utils');
const { check, validationResult } = require('express-validator');

const validateLaughbox = [
  // TODO: create validation for laughbox
]

const laughboxNotFoundError = (id) => {
  const err = Error(`Laughbox you referred could not be found.`)
  err.title = "Laughbox not found";
  err.status = 404;
  return err;
}

// Laughbox landing page
router.get('/', csrfProtection, asyncHandler(async (req, res) => {
  const laughboxes = await db.LaughBox.findAll({ include: 'User'})
  res.render('laughboxes', { title: 'LaughBoxes', laughboxes });
}));

// Create new laughbox
router.post('/', csrfProtection, asyncHandler(async (req, res) => {
  const { name } = req.body;

  const laughbox = db.LaughBox.build({
    name,
  });
  res.render('laughboxes', {
    title: 'Add Laughbox',
    name,
    csrfToken: req.csrfToken()
  })
}))

// Retrieve a specific laughbox
router.get('/:id(\\d+)', csrfProtection, asyncHandler(async (req, res) => {
  res.send('retrieve a specific laughbox')
}))

// Update a specific laughbox's name
router.patch('/:id(\\d+)', csrfProtection, asyncHandler(async (req, res) => {
  const laughboxId = parseInt(req.params.id, 10);
  const laughbox = await db.Laughbox.findByPk(laughboxId);

  if (laughbox) {
    await laughbox.update({ name: req.body.name })
  } else {
    next(laughboxNotFoundError(laughboxId))
  }
}))

// Delete a specific laughbox
router.delete('/:id(\\d+)', csrfProtection, asyncHandler(async (req, res) => {
  const laughboxId = parseInt(req.params.id, 10);
  const laughbox = await db.Laughbox.findByPk(laughboxId);

  if (laughbox) {
    await laughbox.destroy();
    res.status(204).end();
  } else {
    next(laughboxNotFoundError(laughboxId))
  }
}))

module.exports = router;
