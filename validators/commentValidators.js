const { body } = require("express-validator");

const addCommentValidationRules = () => [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 6 })
    .withMessage("Content must be at least 6 characters long")
    .isLength({ max: 1000 })
    .withMessage("Content maximum 1000 characters long"),
  body("rating")
    .isInt({ min: 1, max: 3 })
    .withMessage("Rating must be an integer between 1 and 3"),
];

module.exports = {
  addCommentValidationRules,
};
