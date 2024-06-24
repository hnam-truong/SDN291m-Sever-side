const passport = require("passport");

class googleController {
  getAuthGoogle(req, res, next) {
    passport.authenticate("google", { scope: ["email", "profile"] })(
      req,
      res,
      next
    );
  }

  getGoogleCallback(req, res, next) {
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/login",
    })(req, res, next);
  }

  // getAuthFailure(req, res) {
  //   res.send("something went wrong!");
  // }

  // getProtected(req, res, next) {
  //   if (req.isAuthenticated()) {
  //     console.log(req.user);
  //     res.send(`Hello! ${req.user.displayName}`);
  //   } else {
  //     res.sendStatus(401);
  //   }
  // }
}

module.exports = new googleController();
