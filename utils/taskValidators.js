// validations/taskValidation.js

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

  // (Optional) Validate "time" if you'd like:
  // body('time')
  //   .optional()
  //   .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  //   .withMessage('Invalid time format, use HH:MM'),
];
