const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Member = require("../models/member");

const GOOGLE_CLIENT_ID = "";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: "",
      callbackURL: "http://localhost:3000/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        // Check if user exists in the database
        let user = await Member.findOne({ memberName: profile.email });

        if (!user) {
          // Generate a random password
          const randomPassword = crypto.randomBytes(16).toString("hex");
          const hashPassword = await bcrypt.hash(randomPassword, 10);

          // Create a new user
          user = new Member({
            memberName: profile.email,
            password: hashPassword,
          });

          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
