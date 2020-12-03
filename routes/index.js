var express = require('express');
var router = express.Router();
const { csrfProtection, asyncHandler} = require('../utils');
const db = require('../db/models');

/* GET home page. */
router.get('/', function(req, res, next) {
  let username = [];

  if (req.session.user) {
    username.push(req.session.user.username);
  }

  res.render('index', {
    title: 'GoodLaughs',
    username,
  });
});



router.get('/laughfeed', csrfProtection, asyncHandler(async (req, res, next) => {
  // when you login, send you here - do in other files
  // have this option on each laugh page - do in other pug file or navbar

  // look to what user is logged in
  const userId = req.session.user.id
  // get all their laughs
  const laughs = await db.Laugh.findAll({
    where: {
      userId
    },
    include: db.User
  });

  // console.log(laughs.keys())

  // for (const key in laughs[0]) {
  //   console.log(laughs[0][key])
  // }

  // console.log(laughs[0].map((laugh) => console.log(laugh)));

  // const laughReviews = laughs.map(laugh => {
  //   db.Review.findAll({
  //     where: {
  //       laughId: laugh.id
  //     }
  //   })
  // });

  // const laughRatings = laughs.map(laugh => {
  //   db.Rating.findAll({
  //     where: {
  //       laughId: laugh.id
  //     }
  //   })
  // });

  // display most recent 10 laughs
  res.render('laughfeed', {
    title: 'Laughs',
    csrfToken: req.csrfToken(),
    laughs
  });

  // option to go back/forward to get the other laughs -- bonus feature
}));

module.exports = router;
