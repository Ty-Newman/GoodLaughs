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

    const rating = await db.Rating.findOne({ where: { laughId } });
    if (rating === null) {
      db.Rating.build({
        bows: true,
        lols: null,
        userId: req.params.user.id,
        laughId,
      });
    } else {
      rating.update({ bows: !rating.bows });
    }

    res.redirect("/");
  })
);

// Add a new review
// router.post(
//   "/:id(\\d+)",
//   csrfProtection,
//   validateReview,
//   handleValidationErrors,
//   asyncHandler(async (req, res, next) => {
//     const { reviewBody } = req.body;
//     const userId = parseInt(req.session.user.id);
//     const laughId = parseInt(req.params.id, 10);

//     const validateErrors = validationResult(req);

//     if (validateErrors.insEmpty()) {
//       await db.Review.create({
//         body: reviewBody,
//         userId: userId,
//         laughId: laughId,
//       });

//       res.redirect("/");
//     } else {
//       const errors = validateErrors.array().map((error) => {
//         res.render("reviews", {
//           title: "Add a new Review",
//           body,
//           errors,
//           csrfToken: req.csrfToken(),
//         });
//       });
//     }
//   })
// );

module.exports = router;
