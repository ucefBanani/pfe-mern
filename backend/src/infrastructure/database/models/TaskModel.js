const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['Backlog', 'Todo', 'In Progress', 'Review', 'Done'], default: 'Todo', index: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium', index: true },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  dueDate: { type: Date, default: null },
  label: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);
