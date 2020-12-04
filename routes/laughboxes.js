const express = require('express');
const router = express.Router();
const { csrfProtection, asyncHandler} = require('../utils');
const db = require('../db/models');
const {check, validationResult} = require('express-validator');
const { noExtendLeft } = require('sequelize/types/lib/operators');

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
router.get('/', csrfProtection, (req, res) => {
  // const laughbox = db.Laughbox.build();
  const errors = [];

  if (!req.session.user) {
    errors.push("You must log in to view your laughbox!")
    res.render('laughboxes-logged-out', {
      title: 'Please log in',
      csrfToken: req.csrfToken(),
    })

  }
})

// Create new laughbox
router.post('/', csrfProtection, asyncHandler(async (req, res) => {
  res.send('create new laughbox')
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
    noExtendLeft(laughboxNotFoundError(laughboxId))
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
    noExtendLeft(laughboxNotFoundError(laughboxId))
  }
}))

module.exports = router;
