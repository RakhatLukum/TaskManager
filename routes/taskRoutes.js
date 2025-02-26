const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const { createTaskValidation } = require('../validations/taskValidation');
const { validationResult } = require('express-validator');

router.use(authMiddleware);

// Create task route
router.post('/', createTaskValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  
  taskController.createTask(req, res, next);
});

// Get all tasks with optional search query
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
