const Task = require('../models/taskModel');

// Получение всех задач
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId });
    res.json(tasks); // Возвращаем задачи текущего пользователя
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Ошибка сервера' });
  }
};

// Создание задачи
exports.createTask = async (req, res) => {
  const { title, description, dueDate, status } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      status,
      user: req.user.userId // Связываем задачу с пользователем
    });

    await newTask.save();
    res.status(201).json(newTask); // Возвращаем созданную задачу
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Ошибка при создании задачи' });
  }
};

// Обновление задачи
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, status } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(id, { title, description, dueDate, status }, { new: true });
    
    if (!task) {
      return res.status(404).json({ msg: 'Задача не найдена' });
    }

    res.json(task); // Возвращаем обновленную задачу
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Ошибка при обновлении задачи' });
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
    console.error(error.message);
    res.status(500).json({ msg: 'Ошибка при удалении задачи' });
  }
};

