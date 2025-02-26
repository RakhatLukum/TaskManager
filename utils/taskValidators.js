const { body } = require('express-validator');

exports.createTaskValidation = [
  // Title is required
  body('title')
    .notEmpty()
    .withMessage('Title is required'),

  // Status is optional, but if provided, must be one of the allowed
  body('status')
    .optional()
    .isIn(['not-started', 'incomplete', 'finished'])
    .withMessage('Invalid status value'),
];
