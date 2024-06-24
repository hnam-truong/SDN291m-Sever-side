const { body } = require("express-validator");

const addWatchValidationRules = () => [
  body("watchName")
    .trim()
    .notEmpty()
    .withMessage("Watch name is required")
    .isLength({ min: 3 })
    .withMessage("Watch name must be at least 3 characters long"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a number greater than 0"),
  body("image")
    .trim()
    .notEmpty()
    .withMessage("Image URL is required")
    .isURL()
    .withMessage("Image must be a valid URL"),
  body("watchDescription")
    .trim()
    .notEmpty()
    .withMessage("Watch description is required")
    .isLength({ min: 6 })
    .withMessage("Description must be at least 6 characters long")
    .isLength({ max: 1000 })
    .withMessage("Description maximum 1000 characters long"),
  body("brand").trim().notEmpty().withMessage("Brand is required"),
];

module.exports = {
  addWatchValidationRules,
};
