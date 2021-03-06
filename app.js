const { sessionSecret } = require("./config");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const cookieParser = require("cookie-parser");
const { sequelize } = require("./db/models");
const express = require("express");
const session = require("express-session");
const createError = require("http-errors");
const logger = require("morgan");
const path = require("path");
const indexRouter = require("./routes/index");
const laughboxesRouter = require("./routes/laughboxes");
const laughsRouter = require("./routes/laughs");
const reviewsRouter = require("./routes/reviews");
const usersRouter = require("./routes/users");

const app = express();

// view engine setup
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// set up session middleware
const store = new SequelizeStore({ db: sequelize });

app.use(
  session({
    secret: sessionSecret,
    store,
    saveUninitialized: false,
    resave: false,
  })
);

const checkUser = (req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
};

app.use(checkUser);

// create Session table if it doesn't already exist
store.sync();

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/laughs", laughsRouter);
app.use("/laughboxes", laughboxesRouter);
app.use("/reviews", reviewsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  errors = [res.locals.error];
  res.render("error", { errors });
});

module.exports = app;
