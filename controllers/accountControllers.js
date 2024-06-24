var bcrypt = require("bcrypt");
const passport = require("passport");
const Member = require("../models/member");
const { validationResult } = require("express-validator");
class accountController {
  // Sign up
  renderSignupAccount(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    res.render("signup", {
      success: req.flash("success"),
      message: req.flash("message"),
    });
  }
  async signupAccount(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err) => err.msg);
        req.flash("message", errorMessages.join(", "));
        req.flash("success", false);
        return res.redirect("/signup");
      }

      const { memberName, password } = req.body;

      // Check if member already exists
      const existMember = await Member.findOne({
        memberName: memberName.toLowerCase(),
      });

      if (existMember) {
        req.flash("message", "Member already exists");
        req.flash("success", false);
        return res.redirect("/signup");
      }

      // Hash the password
      const hashPassword = await bcrypt.hash(password, 10);

      // Create new member
      const newMember = new Member({
        memberName: memberName.toLowerCase(),
        password: hashPassword,
      });

      // Save the new member to the database
      await newMember.save();

      // Set success flash message
      req.flash("message", "Register successfully");
      req.flash("success", true);
      return res.redirect("/signup");
    } catch (error) {
      console.error("Error while signing up:", error);
      req.flash("message", "Error while adding member");
      req.flash("success", false);
      return res.redirect("/signup");
    }
  }

  // Login
  renderLoginAccount(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    res.render("login", {
      success: req.flash("success"),
      message: req.flash("message"),
    });
  }
  async loginAccount(req, res, next) {
    passport.authenticate("local", (err, member, info) => {
      if (err) {
        console.error("Error during authentication:", err);
        req.flash("message", "Error during authentication");
        req.flash("success", false);
        return res.redirect("/login");
      }
      if (!member) {
        req.flash("message", "Incorrect username or password.");
        req.flash("success", false);
        return res.redirect("/login");
      }
      req.logIn(member, (err) => {
        if (err) {
          console.error("Error during session persistence:", err);
          req.flash("message", "Error during login");
          req.flash("success", false);
          return res.redirect("/login");
        }
        // req.flash("message", "Login successfully!");
        req.flash("success", true);
        return res.redirect("/");
      });
    })(req, res, next);
  }

  logoutAccount(req, res, next) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.session.destroy();
      return res.redirect("/");
    });
  }

  async getListOfAccount(req, res) {
    try {
      const accounts = await Member.find()
        .sort({ updatedAt: -1, createdAt: -1 })
        .lean();
      res.status(200).render("adminAccounts", {
        accountData: accounts,
      });
    } catch (error) {
      console.log(error);
      res.status(500).render("error");
    }
  }

  // Profile
  renderProfile(req, res) {
    res.render("profile", {
      memberName: req.user.memberName,
      success: req.flash("success"),
      messageName: req.flash("messageName"),
      message: req.flash("message"),
    });
  }
  async changeMemberName(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(
        "messageName",
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
      req.flash("success", false);
      return res.redirect("/profile");
    }

    const { memberName } = req.body;
    try {
      const member = await Member.findById(req.user._id);
      member.memberName = memberName;

      const existMember = await Member.findOne({
        memberName: memberName.toLowerCase(),
      });

      if (existMember) {
        req.flash("messageName", "Username already exists");
        req.flash("success", false);
        return res.redirect("/profile");
      }

      await member.save();
      req.flash("messageName", "Name changed successfully");
      req.flash("success", true);
      res.redirect("/profile");
    } catch (error) {
      console.log("changeMemberName error", error);
      req.flash("messageName", "Error while changing name");
      req.flash("success", false);
      res.redirect("/profile");
    }
  }
  async changePassword(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(
        "message",
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
      req.flash("success", false);
      return res.redirect("/profile");
    }

    const { currentPassword, newPassword } = req.body;
    try {
      const member = await Member.findById(req.user._id);
      const isMatch = await bcrypt.compare(currentPassword, member.password);

      if (!isMatch) {
        req.flash("message", "Current password is incorrect");
        req.flash("success", false);
        return res.redirect("/profile");
      }

      const checkDuplicated = currentPassword === newPassword;
      if (checkDuplicated) {
        req.flash(
          "message",
          "Cannot change the password if same with current password"
        );
        req.flash("success", false);
        return res.redirect("/profile");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      member.password = hashedPassword;
      await member.save();
      req.flash("message", "Password changed successfully");
      req.flash("success", true);
      res.redirect("/profile");
    } catch (error) {
      console.log("changePassword error", error);
      req.flash("message", "Error while changing password");
      req.flash("success", false);
      res.redirect("/profile");
    }
  }
}

module.exports = new accountController();
