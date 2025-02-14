// validations/taskValidation.js
const { body } = require('express-validator');

exports.createTaskValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Invalid status value'),
];
