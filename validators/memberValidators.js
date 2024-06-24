const { body } = require("express-validator");

const signupMemberValidationRules = () => [
  body("memberName")
    .trim()
    .notEmpty()
    .withMessage("Member name is required")
    .isLength({ min: 3 })
    .withMessage("Member name must be at least 3 characters long"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const changePasswordValidationRules = () => [
  body("currentPassword")
    .trim()
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];

const changeMemberNameValidationRules = () => [
  body("memberName")
    .trim()
    .notEmpty()
    .withMessage("Member name is required")
    .isLength({ min: 3 })
    .withMessage("Member name must be at least 3 characters long"),
];

module.exports = {
  signupMemberValidationRules,
  changePasswordValidationRules,
  changeMemberNameValidationRules,
};
