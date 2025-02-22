// routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController'); // Import the task controller
const authMiddleware = require('../middlewares/authMiddleware'); // Import the authentication middleware
const { createTaskValidation } = require('../validations/taskValidation'); // Import task validation for creating tasks
const { validationResult } = require('express-validator'); // Import validation result to check for errors

// All /api/tasks routes require a valid token, so authMiddleware is applied to all routes
router.use(authMiddleware);

// Create task route
router.post('/', createTaskValidation, (req, res, next) => {
  // First, check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array() // Return validation errors if any
    });
  }
  
  // If no validation errors, proceed to the controller to create the task
  taskController.createTask(req, res, next);
});

// Get all tasks with optional search query
// If a search query is provided, it filters tasks by title
router.get('/', taskController.getTasks); // Handles fetching tasks with an optional search query

// Get a specific task by its ID
router.get('/:id', taskController.getTaskById); // Fetch task by ID

// Update a specific task by its ID
router.put('/:id', taskController.updateTask); // Handle task update

// Delete a specific task by its ID
router.delete('/:id', taskController.deleteTask); // Handle task deletion

module.exports = router; // Export the router for use in server.js
