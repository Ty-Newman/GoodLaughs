const { asyncHandler, csrfProtection, loginUserCheck } = require("../utils");
const db = require("../db/models");
const express = require("express");
const router = express.Router();

router.get(
  "/:laughId(\\d+)",
  csrfProtection,
  loginUserCheck,
  asyncHandler(async (req, res, next) => {
    const laughId = req.params.laughId;
    const userId = req.session.user.id;

    const rating = await db.Rating.findOne({ where: { laughId, userId } });

    if (rating === null) {
      db.Rating.create({
        bows: true,
        lols: null,
        userId,
        laughId,
      });
    } else {
      rating.update({ bows: !rating.bows });
    }

    res.redirect("/");
  })
);

// Add a new review
router.get(
  "/:laughId(\\d+)/:starRating(\\d+)",
  csrfProtection,
  loginUserCheck,
  asyncHandler(async (req, res, next) => {
    const laughId = req.params.laughId;
    const starRating = req.params.starRating;
    const userId = req.session.user.id;

    const rating = await db.Rating.findOne({ where: { laughId, userId } });

    if (rating === null) {
      db.Rating.create({
        bows: false,
        lols: starRating,
        userId,
        laughId,
      });
    } else {
      rating.update({ lols: starRating });
    }

    res.redirect("/");
  })
);

module.exports = router;
