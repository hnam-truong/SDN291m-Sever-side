const { body } = require('express-validator');

const addBrandValidationRules = () => [
    body('brandName')
        .trim()
        .notEmpty()
        .withMessage('Brand name is required')

];

module.exports = {
    addBrandValidationRules
};
