// routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const { createTaskValidation } = require('../validations/taskValidation');
const { validationResult } = require('express-validator');

// All /api/tasks routes require token
router.use(authMiddleware);

// Create task
router.post('/', createTaskValidation, (req, res, next) => {
  // Check for validation errors first
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  
  // If no validation errors, proceed to controller
  taskController.createTask(req, res, next);
});

// Get all tasks
router.get('/', taskController.getAllTasks);

// Get a specific task by ID
router.get('/:id', taskController.getTaskById);

// Update a task
router.put('/:id', taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
