const express = require("express");
const router = express.Router();
const db = require("../db/models");
const { Sequelize } = require("../db/models");
const {
  csrfProtection,
  asyncHandler,
  handleValidationErrors,
  loginUserCheck,
} = require("../utils");
const { check, validationResult } = require("express-validator");

// const validateReview = [
//   check("reviewBody")
//     .exists({ checkFalsy: true })
//     .withMessage("Please provide your review."),
//   check("reviewBody")
//     .isLength({ max: 200 })
//     .withMessage("Your review cannot be longer than 200 characters."),
// ];

// const laughNotFoundError = (id) => {
//   const err = Error("Laugh you referred could not be found.");
//   err.title = "Laugh not found";
//   err.status = 404;
//   return err;
// };

// const reviewNotFoundError = (id) => {
//   const err = Error("Review you referred could not be found.");
//   err.title = "Review not found";
//   err.status = 404;
//   return err;
// };

router.get(
  "/:laughId(\\d+)",
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
  // csrfProtection,
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
