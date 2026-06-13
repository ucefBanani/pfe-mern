const mongoose = require('mongoose');

const WorkspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const WorkspaceMemberSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  role: { type: String, enum: ['Admin', 'Member'], default: 'Member' },
  joinedAt: { type: Date, default: Date.now }
});

WorkspaceMemberSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });

const Workspace = mongoose.model('Workspace', WorkspaceSchema);
const WorkspaceMember = mongoose.model('WorkspaceMember', WorkspaceMemberSchema);

module.exports = { Workspace, WorkspaceMember };
