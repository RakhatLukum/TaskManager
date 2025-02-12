const mongoose = require('mongoose');
const Task = require('../models/taskModel');

// Создание задачи
exports.createTask = async (req, res) => {
  const { title, description, dueDate } = req.body;

  try {
    const task = new Task({ title, description, dueDate, user: req.user.userId });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ msg: 'Ошибка создания задачи' });
  }
};

// Получение всех задач
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ msg: 'Ошибка получения задач' });
  }
};

// Обновление задачи
exports.updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ msg: 'Задача не найдена' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ msg: 'Ошибка обновления задачи' });
  }
};

// Удаление задачи
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ msg: 'Задача не найдена' });
    }
    res.json({ msg: 'Задача удалена' });
  } catch (error) {
    res.status(500).json({ msg: 'Ошибка удаления задачи' });
  }
};

// Получение одной задачи по ID
exports.getTaskById = async (req, res) => {
    const { id } = req.params;
  
    // Проверка, является ли id валидным ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Неверный формат ID' });
    }
  
    try {
      const task = await Task.findById(id);
      
      if (!task) {
        return res.status(404).json({ msg: 'Задача не найдена' });
      }
  
      res.json(task);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Ошибка сервера' });
    }
  };

