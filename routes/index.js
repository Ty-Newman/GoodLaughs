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
      const rating = await db.Rating.findAll({
        where: {
          laughId: laugh.id,
          userId: loggedInUserId,
        },
      });

      let bows = false;
      let lols = null;

      if (rating[0]) {
        bows = rating[0].bows;
        lols = rating[0].lols;
      }

      laugh.bows = bows;
      laugh.lols = lols;

      const reviews = await db.Review.findAll({
        where: {
          laughId: laugh.id,
        },
        include: db.User,
      });

      laugh.reviews = reviews;

      let reviewByLoggedInUser = false;

      for (let i = 0; i < reviews.length; i++) {
        console.log("this review", reviews[i]);
        console.log("this type", typeof laugh.User.id);
        if (reviews[i].userId === laugh.User.id) {
          reviewByLoggedInUser = true;
          break;
        } 
      }

      laugh.reviewByLoggedInUser = reviewByLoggedInUser;

      let review = null;
      if (reviews[0]) {
        review = reviews[0].body;
      }

      laugh.review = review;

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
