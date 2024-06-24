var express = require("express");
var commentRouter = express.Router();
const commentController = require("../controllers/commentControllers");
const { isAuth } = require("./authMiddleware");
const { addCommentValidationRules } = require("../validators/commentValidators");

commentRouter
  .route("/comments/add/:id")
  .post(isAuth, addCommentValidationRules(), commentController.addCommentToWatch);

module.exports = commentRouter;
