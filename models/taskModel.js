// models/taskModel.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
  },
  description: {
    type: String,
    default: '',
  },
  // Updated status with 3 stages
  status: {
    type: String,
    enum: ['not-started', 'incomplete', 'finished'],
    default: 'not-started',
  },
  dueDate: {
    type: Date,
    default: null,
  },
  // New field for hours/minutes
  time: {
    type: String, // Storing in "HH:MM" format or "10:30 AM" etc.
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
