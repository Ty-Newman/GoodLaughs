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
router.get('/', csrfProtection, asyncHandler(async (req, res, next) => {
  // const laughbox = db.Laughbox.build();
  const errors = [];

  if (!req.session.user) {
    errors.push("You must log in to view your laughbox!")
    res.render('laughboxes-logged-out', {
      title: 'Please log in',
      errors,
    })
  }
  //   res.render('laughboxes', {
  //   title: 'Your Laughboxes',
  //   csrfToken: req.csrfToken(),
  // })
  const userId = req.session.user.id;
  const laughboxes = await db.LaughBox.findAll(
  {
    where: 
      { userId },
    order: 
      [['name', 'ASC']],
    include: db.LaughBoxLaughs
  });
  console.log(laughboxes.LaughBoxLaughs)
  res.render('laughboxes', {
    title: 'LaughBoxes',
    laughboxes,
    body: '',
  });
}))


// Laughbox landing page
// router.get('/', csrfProtection, asyncHandler(async (req, res) => {

// }));

// router.get("/", csrfProtection, (req, res) => {
//   res.render("laughboxes", {
//     body: '',
//     csrfToken: req.csrfToken(),
//   });
// });

// Create new laughbox
router.post('/', asyncHandler(async (req, res) => {
  const { laughbox } = req.body;
  const userId = req.session.user.id;
  const err = '';

  const madeLaughbox = db.LaughBox.build({
    name: laughbox,
    userId
  });
  await madeLaughbox.save();
  // res.render('laughboxes', {
  //   title: 'Add Laughbox',
  //   name: laughbox,
  //   error: err,
  //   // csrfToken: req.csrfToken(),
  // });
  res.redirect('/laughboxes');

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
