const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Получение всех задач пользователя
router.get('/tasks', authMiddleware, getTasks);

// Добавление новой задачи
router.post('/tasks', authMiddleware, createTask);

// Обновление задачи
router.put('/tasks/:id', authMiddleware, updateTask);

// Удаление задачи
router.delete('/tasks/:id', authMiddleware, deleteTask);

module.exports = router;
