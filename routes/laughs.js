const { body, check, validationResult } = require("express-validator");
const express = require("express");
const { Sequelize } = require("../db/models");

const {
  asyncHandler,
  csrfProtection,
  handleValidationErrors,
  loginUserCheck,
} = require("../utils");
const db = require("../db/models");

const router = express.Router();
const Op = Sequelize.Op;

const validateLaugh = [
  check("laughBody")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a joke."),
  check("lols"),
  // .not()
  // .isInt({ lt: 1, gt: 5 })
  // .withMessage("Please provide a number between 1 and 5."),
  //   .isFloat({ min: 1, max: 5 })
  //   .withMessage("Please provide a number between 1 and 5."),
];

// const validateLogin = [
//   check("username")
//     .exists({ checkFalsy: true })
//     .withMessage("Please provide your login username."),
//   check("username")
//     .isLength({ max: 30 })
//     .withMessage("Your username cannot be longer than 30 characters."),
//   check("password")
//     .exists({ checkFalsy: true })
//     .withMessage("Please provide your password."),
// ];

const validateEditLaugh = [
  // check('laughBody')
  // .exists({ checkFalsy: true })
  // .withMessage("Please provide a joke."),
];

const laughNotFoundError = (id) => {
  const err = Error(`Laugh you referred could not be found.`);
  err.title = "Laugh not found";
  err.status = 404;
  return err;
};

router.get(
  "/",
  csrfProtection,
  loginUserCheck,
  asyncHandler(async (req, res, next) => {
    res.render("laughs", {
      title: "Add a Laugh",
      body: "",
      errors: "",
      csrfToken: req.csrfToken(),
    });
  })
);

router.post(
  "/",
  csrfProtection,
  loginUserCheck,
  validateLaugh,
  handleValidationErrors,
  asyncHandler(async (req, res, next) => {
    const { laughBody, bows, lols, reviewBody } = req.body;
    const userId = req.session.user.id;
    const userIdInt = parseInt(userId);
    const bowsBoolean = bows === "on" ? true : false;
    let lolsInt = parseInt(lols);

    await db.Laugh.create({ body: laughBody, userId });
    const savedLaugh = await db.Laugh.findOne({
      where: {
        [Op.and]: [{ userId: userIdInt }, { body: laughBody }],
      },
      include: db.User,
    });

    const laughIdInt = parseInt(savedLaugh.id);

    if (Number.isNaN(lolsInt)) {
      lolsInt = null;
    }

    await db.Rating.create({
      bows: bowsBoolean,
      lols: lolsInt,
      userId: userIdInt,
      laughId: laughIdInt,
    });

    if (reviewBody !== undefined) {
      await db.Review.create({
        body: reviewBody,
        userId: userIdInt,
        laughId: laughIdInt,
      });
    }

    res.redirect("/");
  })
);

// Retrieve a specific laugh
router.get(
  "/:id(\\d+)",
  csrfProtection,
  loginUserCheck,
  asyncHandler(async (req, res, next) => {
    const laughId = parseInt(req.params.id, 10);
    const laugh = await db.Laugh.findByPk(laughId);
    const laughUserId = laugh.userId;
    const url = req.baseUrl + req.url;
    const errors = "";

    if (parseInt(laughUserId) !== parseInt(req.session.user.id)) {
      const err = new Error(
        "This user cannot edit this laugh. Please login as the user who created this laugh or visit another laugh. Thank you very much"
      );
      next(err);
    }

    let userIdInt = "";
    if (req.session.user.id == laughUserId) {
      userIdInt = parseInt(laughUserId);
    } else {
      userIdInt = parseInt(req.session.user.id);
    }

    const user = await db.User.findOne({
      where: { id: userIdInt },
    });

    let rating = await db.Rating.findOne({
      where: {
        [Op.and]: [{ userId: userIdInt }, { laughId }],
      },
    });

    let review = await db.Review.findOne({
      where: {
        [Op.and]: [{ userId: userIdInt }, { laughId }],
      },
    });

    pugObject = { laugh, user, rating, review, url, errors };
    if (req.session.user.id == laughUserId) {
      res.render("laugh", pugObject);
    } else {
      res.render("reviews", pugObject);
    }
  })
);

// Update a specific laugh
router.post(
  "/:id(\\d+)/update",
  csrfProtection,
  loginUserCheck,
  validateEditLaugh,
  handleValidationErrors,
  asyncHandler(async (req, res, next) => {
    const url = req.baseUrl + req.url;

    const laughId = parseInt(req.params.id, 10);
    const laugh = await db.Laugh.findByPk(laughId);

    const laughUserId = parseInt(laugh.userId);
    const loggedInUserId = parseInt(req.session.user.id);

    // const errors = '';

    // const review = await db.Review.findOne({
    //   where: {
    //     [Op.and] : [
    //       { userId: loggedInUserId },
    //       { laughId }
    //     ]
    //   }
    // });

    // const rating = await db.Rating.findOne({
    //   where: {
    //     [Op.and] : [
    //       { userId: loggedInUserId },
    //       { laughId }
    //     ]
    //   }
    // });

    const { laughBody, bows, lols, reviewBody } = req.body;
    if (laugh && laughUserId === loggedInUserId) {
      laugh.body = laughBody;
      // rating.bows = bows;
      // rating.lols = lols;
      // review.body = reviewBody;
      await laugh.save();
      // await rating.save();
      // await review.save();
    }
    // else if (laugh) {
    //   rating.bows = bows;
    //   rating.lols = lols;
    //   review.body = reviewBody;
    //   await rating.save();
    //   await review.save();
    // }
    else {
      next(laughNotFoundError(laughId));
    }

    // const user = await db.User.findOne({
    //   where: { id: loggedInUserId }
    // });
    // pugObject = { laugh, user, rating, review, url, errors }
    // let nextUrl = url.split("/update")[0];
    // console.log(nextUrl);
    res.redirect("/");
  })
);

// Delete a specific laugh
router.get(
  "/:id(\\d+)/delete",
  csrfProtection,
  loginUserCheck,
  asyncHandler(async (req, res, next) => {
    const laughId = parseInt(req.params.id, 10);
    const laugh = await db.Laugh.findByPk(laughId);
    const loggedInUserId = parseInt(req.session.user.id);

    const reviews = await db.Review.findAll({
      where: {
        laughId,
      },
    });

    for (let i = 0; i < reviews.length; i++) {
      await reviews[i].destroy();
    }

    const ratings = await db.Rating.findAll({
      where: {
        laughId,
      },
    });

    for (let i = 0; i < ratings.length; i++) {
      await ratings[i].destroy();
    }

    if (laugh) {
      await laugh.destroy();
      res.redirect("/");
    } else {
      next(laughNotFoundError(taskId));
    }
  })
);

// Retrieve a specific laughs reviews
router.get(
  "/:id(\\d+)/reviews",
  csrfProtection,
  loginUserCheck,
  asyncHandler(async (req, res, next) => {
    const laughId = parseInt(req.params.id, 10);
    const laugh = await db.Laugh.findByPk(laughId);
    const laughUserId = laugh.userId;
    const url = req.baseUrl + req.url;
    const errors = "";

    let userIdInt = "";
    if (req.session.user.id == laughUserId) {
      userIdInt = parseInt(laughUserId);
    } else {
      userIdInt = parseInt(req.session.user.id);
    }

    const laughCreatorUser = await db.User.findOne({
      where: { id: laughUserId },
    });
    const user = laughCreatorUser;

    let reviews = await db.Review.findAll({
      where: { laughId },
      include: db.User,
    });
    let noReviews = {};

    if (reviews.length === 0) {
      noReviews = {
        user: {
          username: laughCreatorUser.username,
        },
        laugh: {
          body: laugh.body,
        },
      };
    }

    const userReview = await db.Review.findOne({
      where: {
        [Op.and]: [{ userId: parseInt(req.session.user.id) }, { laughId }],
      },
    });

    pugObject = { laugh, reviews, noReviews, userReview, user, url, errors };
    res.render("reviews", pugObject);
  })
);

// get a specific laugh's reviews
router.post(
  "/:id(\\d+)/reviews",
  csrfProtection,
  loginUserCheck,
  asyncHandler(async (req, res, next) => {
    const laughId = parseInt(req.params.id, 10);
    const laugh = await db.Laugh.findByPk(laughId);
    const laughUserId = parseInt(laugh.userId);
    const userIdInt = parseInt(req.session.user.id);
    const { reviewBody } = req.body;
    const url = req.baseUrl + req.url;
    const errors = "";

    let review = await db.Review.findOne({
      where: {
        [Op.and]: [{ userId: userIdInt }, { laughId }],
      },
    });

    if (review) {
      review.body = reviewBody;
      await review.save();
    } else {
      console.log(reviewBody, req.session.user.id, req.params.id);
      await db.Review.create({
        body: reviewBody,
        userId: req.session.user.id,
        laughId: req.params.id,
      });
    }

    let reviews = await db.Review.findAll({
      where: { laughId },
      include: db.User,
    });

    const laughCreatorUser = await db.User.findOne({
      where: { id: laughUserId },
    });
    const user = laughCreatorUser;
    pugObject = { laugh, reviews, user, url, errors };
    res.redirect(url); // re-run a router route
  })
);

// Delete a review
router.get(
  "/:id(\\d+)/reviews/delete",
  csrfProtection,
  loginUserCheck,
  handleValidationErrors,
  asyncHandler(async (req, res, next) => {
    const laughId = parseInt(req.params.id, 10);
    const userId = parseInt(req.session.user.id);

    const review = await db.Review.findOne({
      where: {
        [Op.and]: [{ userId }, { laughId }],
      },
    });

    if (review) {
      await review.destroy();
      const url = req.baseUrl + req.params.id + "/reviews";
      res.redirect(url);
    } else {
      const err = new Error("Review not found");
      next(err);
    }
  })
);

module.exports = router;
