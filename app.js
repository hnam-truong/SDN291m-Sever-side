var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/connectDB");

const watchRouter = require("./routes/watchRouter");
const googleRouter = require("./routes/googleRouter");
const accountRouter = require("./routes/accountRouter");
const brandRouter = require("./routes/brandRouter");
const profileRouter = require("./routes/profileRouter");
const commentRouter = require("./routes/commentRouter");

var app = express();

connectDB();

const url = "mongodb://localhost:27017/watchAssignment";
const connect = mongoose.createConnection(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sessionStore = MongoStore.create({
  mongooseConnection: connect,
  collection: "sessions",
  mongoUrl: "mongodb://localhost:27017/watchAssignment",
});

app.use(
  session({
    name: "session-id",
    secret: "secret key",
    saveUninitialized: true,
    resave: false,
    store: sessionStore,
  })
);
app.use(flash());

require("./config/auth");
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", accountRouter);
app.use("/", googleRouter);
app.use("/", profileRouter);
app.use("/", watchRouter);
app.use("/", brandRouter);
app.use("/", commentRouter);

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
  res.render("error");
});

module.exports = app;
