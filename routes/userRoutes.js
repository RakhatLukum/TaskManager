const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { registerValidation, loginValidation } = require('../validations/userValidation');
const { validationResult } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');

// Public endpoints
router.post('/register', registerValidation, (req, res, next) => {
  // Check validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  userController.registerUser(req, res, next);
});

router.post('/login', loginValidation, (req, res, next) => {
  // Check validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  userController.loginUser(req, res, next);
});

// Private endpoints
router.get('/profile', authMiddleware, userController.getUserProfile);
router.put('/profile', authMiddleware, userController.updateUserProfile);

module.exports = router;
