var express = require("express");
var watchRouter = express.Router();
const watchController = require("../controllers/watchControllers");
const { addWatchValidationRules } = require("../validators/watchValidators");
const { isAdmin } = require("./authMiddleware");

watchRouter.route("/").get(watchController.getListOfWatch);
// watchRouter.route("/watch").post(watchController.createWatch);

watchRouter.route("/watch").get(watchController.getListOfWatch);
watchRouter.route("/watch/:id").get(watchController.getWatchById);

watchRouter
  .route("/admin/watches")
  .get(isAdmin, watchController.getListOfAdminWatch);

watchRouter
  .route("/admin/watches/add")
  .get(isAdmin, watchController.renderAddWatch)
  .post(isAdmin, addWatchValidationRules(), watchController.addNewWatch);

watchRouter
  .route("/admin/watches/edit/:id")
  .get(isAdmin, watchController.renderEditWatch)
  .post(isAdmin, addWatchValidationRules(), watchController.editWatchById);

watchRouter
  .route("/admin/deleteWatch/:id")
  .post(isAdmin, watchController.deleteWatchById);

module.exports = watchRouter;
