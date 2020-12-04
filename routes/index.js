var express = require('express');
var router = express.Router();
const { csrfProtection, asyncHandler} = require('../utils');
const db = require('../db/models');

/* GET home page. */
router.get('/', function(req, res, next) {

  if (req.session.user) {
    username = req.session.user.username;
  }

  res.render('index', {
    title: 'GoodLaughs',
    username,
  });
});



router.get('/laughfeed', csrfProtection, asyncHandler(async (req, res, next) => {

  const loggedInUserId = req.session.user.id;

  const laughs = await db.Laugh.findAll({
    where: {
      userId: loggedInUserId
    },
    include: db.User
  });

  for (let i = 0; i < laughs.length; i ++) {
    const laugh = laughs[i];
    const ratings = await db.Rating.findAll({
      where: {
        laughId: laugh.id
      }
    })

    let bows = [];
    let lols = [];
    if (ratings[0]) {
      bows = ratings[0].bows;
      lols = ratings[0].lols;
    }
    laugh.bows = bows;
    laugh.lols = lols;

    const reviews = await db.Review.findAll({
      where: {
        laughId: laugh.id
      }
    })

    // if we add multiple reviews
    // for no or one laugh
      // attach the review to the laugh
      // append the laugh to laughs
    // for more than one laugh
      // make an inner for loop over each review
        // create a copy of the laugh
        // attach the review to the laugh copy
        // append the laugh copy to laughs
    let review = [];
    if (reviews[0]) {
      review = reviews[0].body;
    }
    laugh.review = review;
  }

  // display most recent 10 laughs
  res.render('laughfeed', {
    title: 'Laughs',
    csrfToken: req.csrfToken(),
    laughs
  });

  // option to go back/forward to get the other laughs -- bonus feature
}));

module.exports = router;
