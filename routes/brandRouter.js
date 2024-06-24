var express = require("express");
var brandRouter = express.Router();
const brandController = require("../controllers/brandControllers");
const { addBrandValidationRules } = require("../validators/brandValidators");
const { isAdmin } = require("./authMiddleware");

brandRouter.route("/admin/brands").get(isAdmin, brandController.getListOfBrand);

brandRouter
  .route("/admin/brands/add")
  .get(isAdmin, brandController.renderAddBrand)
  .post(isAdmin, addBrandValidationRules(), brandController.addNewBrand);

brandRouter
  .route("/admin/brands/edit/:id")
  .get(isAdmin, brandController.renderEditBrand)
  .post(isAdmin, addBrandValidationRules(), brandController.editBrandById);

brandRouter
  .route("/admin/deleteBrand/:id")
  .post(isAdmin, brandController.deleteBrandById);
module.exports = brandRouter;
