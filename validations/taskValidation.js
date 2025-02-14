const { body } = require('express-validator');

exports.createTaskValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),
  
  body('status')
    .optional() // if not provided, defaults to 'not-started'
    .isIn(['not-started', 'incomplete', 'finished'])
    .withMessage('Invalid status value'),

  // Optionally, if you want to validate the time format:
  // body('time')
  //   .optional()
  //   .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  //   .withMessage('Invalid time format, use HH:MM'),
];
