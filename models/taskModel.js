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
  // Allowed status values exactly match what we want:
  status: {
    type: String,
    enum: ['not-started', 'incomplete', 'finished'],
    default: 'not-started',
  },
  dueDate: {
    type: Date,
    default: null,
  },
  time: {
    type: String, // e.g., "10:30"
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
