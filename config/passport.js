const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Member = require("../models/member");
const bcrypt = require("bcrypt");

const customFields = {
  usernameField: "memberName",
  passwordField: "password",
};

const verifyCallback = (memberName, password, done) => {
  Member.findOne({ memberName: memberName.toLowerCase() })
    .then((member) => {
      if (!member) {
        return done(null, false, {
          message: "Incorrect username or password.",
          success: false,
        });
      }

      const isValid = bcrypt.compareSync(password, member.password);

      if (isValid) {
        return done(null, member);
      } else {
        return done(null, false, {
          message: "Incorrect username or password.",
          success: false,
        });
      }
    })
    .catch((err) => {
      return done(err);
    });
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((member, done) => {
  done(null, member.id);
});

passport.deserializeUser((id, done) => {
  Member.findById(id)
    .then((member) => {
      done(null, member);
    })
    .catch((err) => {
      done(err, null);
    });
});
