var express = require('express');
var router = express.Router();
const { csrfProtection, asyncHandler} = require('../utils');
const db = require('../db/models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'GoodLaughs' });
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

  for (let i = 0; i < laughs.length; i ++) {
    const laugh = laughs[i];
    const ratings = db.Rating.findAll({
      where: {
        laughId: laugh.id
      }
    })
    laugh.ratings = ratings;

    const reviews = db.Review.findAll({
      where: {
        laughId: laugh.id
      }
    })
    laugh.reviews = reviews;
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
