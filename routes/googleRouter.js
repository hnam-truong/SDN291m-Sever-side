var express = require("express");
var googleRouter = express.Router();
const googleController = require("../controllers/googleController");

googleRouter.route("/auth/google").get(googleController.getAuthGoogle);
googleRouter.route("/google/callback").get(googleController.getGoogleCallback);

// googleRouter.route("/failure").get(googleController.getAuthFailure);
// googleRouter.route("/protected").get(googleController.getProtected);

module.exports = googleRouter;
