const express = require('express');
const router = express.Router();
const {
  getAllTasksForAdmin,
  createTaskAsAdmin,
  updateTaskAsAdmin,
  deleteTaskAsAdmin
} = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Admin task routes
router.get('/tasks', authMiddleware, adminMiddleware, getAllTasksForAdmin);
router.post('/tasks', authMiddleware, adminMiddleware, createTaskAsAdmin);
router.put('/tasks/:id', authMiddleware, adminMiddleware, updateTaskAsAdmin);
router.delete('/tasks/:id', authMiddleware, adminMiddleware, deleteTaskAsAdmin);

module.exports = router;