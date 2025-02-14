// controllers/taskController.js

const Task = require('../models/taskModel');

// Create a new task
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const newTask = new Task({
      user: req.user.userId, // from authMiddleware
      title,
      description,
      status,
      dueDate,
    });

    await newTask.save();

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask,
    });
  } catch (error) {
    next(error);
  }
};

// Get all tasks for the logged-in user (if normal user)
// If admin, retrieve all tasks
exports.getAllTasks = async (req, res, next) => {
  try {
    let tasks = [];

    if (req.user.role === 'admin') {
      // Admin can fetch all tasks
      tasks = await Task.find().populate('user', '-password');
    } else {
      // Regular user can only fetch their own tasks
      tasks = await Task.find({ user: req.user.userId });
    }

    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

// Get a specific task by ID
exports.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id).populate('user', '-password');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If user is not admin, ensure they own the task
    if (req.user.role !== 'admin' && task.user._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

// Update a task
exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, time } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If user is not admin, ensure they own the task
    if (req.user.role !== 'admin' && task.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (time !== undefined) task.time = time;

    await task.save();

    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a task
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If user is not admin, ensure they own the task
    if (req.user.role !== 'admin' && task.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await task.remove();

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
