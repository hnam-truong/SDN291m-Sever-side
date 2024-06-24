var express = require("express");
var profileRouter = express.Router();
const accountController = require("../controllers/accountControllers");
const { isAuth } = require("./authMiddleware");
const {
  changeMemberNameValidationRules,
  changePasswordValidationRules,
} = require("../validators/memberValidators");

profileRouter.route("/profile").get(isAuth, accountController.renderProfile);

profileRouter
  .route("/profile/changeMemberName")
  .post(
    isAuth,
    changeMemberNameValidationRules(),
    accountController.changeMemberName
  );

profileRouter
  .route("/profile/changePassword")
  .post(
    isAuth,
    changePasswordValidationRules(),
    accountController.changePassword
  );

module.exports = profileRouter;
