var express = require("express");
var accountRouter = express.Router();
const accountController = require("../controllers/accountControllers");
const {
  signupMemberValidationRules,
} = require("../validators/memberValidators");
const { isAdmin } = require("./authMiddleware");

accountRouter
  .route("/login")
  .get(accountController.renderLoginAccount)
  .post(accountController.loginAccount);

accountRouter
  .route("/signup")
  .get(accountController.renderSignupAccount)
  .post(signupMemberValidationRules(), accountController.signupAccount);

accountRouter.route("/logout").get(accountController.logoutAccount);

accountRouter
  .route("/admin/accounts")
  .get(isAdmin, accountController.getListOfAccount);

module.exports = accountRouter;
