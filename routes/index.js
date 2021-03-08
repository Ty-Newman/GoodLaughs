const { csrfProtection, asyncHandler, loginUserCheck } = require("../utils");
const db = require("../db/models");
const express = require("express");
const router = express.Router();

router.get(
  "/",
  loginUserCheck,
  csrfProtection,
  asyncHandler(async (req, res, next) => {
    const loggedInUserId = parseInt(req.session.user.id);
    const laughs = await db.Laugh.findAll({
      include: db.User,
      order: [["updatedAt", "DESC"]],
    });

    for (let i = 0; i < laughs.length; i++) {
      const laugh = laughs[i];
      const ratings = await db.Rating.findAll({
        where: {
          laughId: laugh.id,
          userId: loggedInUserId,
        },
      });

      let bows = false;
      let lols = null;
      if (ratings[0]) {
        bows = ratings[0].bows;
        lols = ratings[0].lols;
      }
      laugh.bows = bows;
      laugh.lols = lols;

      const reviews = await db.Review.findAll({
        where: {
          laughId: laugh.id,
        },
        include: db.User,
      });

      let review = null;
      if (reviews[0]) {
        review = reviews[0].body;
      }
      laugh.review = review;
      laugh.reviews = reviews;

      let createdLaugh = false;
      if (loggedInUserId === parseInt(laugh.User.id)) {
        createdLaugh = true;
      }
      laugh.createdLaugh = createdLaugh;
    }

    res.render("index", {
      title: "Laughs",
      csrfToken: req.csrfToken(),
      laughs,
    });
  })
);

module.exports = router;
