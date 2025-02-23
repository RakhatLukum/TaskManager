const { body } = require('express-validator');

exports.createTaskValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),
  
  body('status')
    .optional() // if not provided, defaults to 'not-started'
    .isIn(['not-started', 'incomplete', 'finished'])
    .withMessage('Invalid status value'),
];
