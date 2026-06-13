const TaskRepository = require('../../domain/repositories/TaskRepository');
const TaskModel = require('../database/models/TaskModel');
const Task = require('../../domain/entities/Task');

class MongoTaskRepository extends TaskRepository {
  _mapToEntity(doc) {
    if (!doc) return null;
    return new Task({
      id: doc._id.toString(),
      projectId: doc.projectId.toString(),
      title: doc.title,
      description: doc.description,
      status: doc.status,
      priority: doc.priority,
      assigneeId: doc.assigneeId ? doc.assigneeId.toString() : null,
      dueDate: doc.dueDate,
      label: doc.label,
      createdAt: doc.createdAt
    });
  }

  async save(taskEntity) {
    const data = {
      projectId: taskEntity.projectId,
      title: taskEntity.title,
      description: taskEntity.description,
      status: taskEntity.status,
      priority: taskEntity.priority,
      assigneeId: taskEntity.assigneeId || null,
      dueDate: taskEntity.dueDate || null,
      label: taskEntity.label || ''
    };

    let doc;
    if (taskEntity.id) {
      doc = await TaskModel.findByIdAndUpdate(taskEntity.id, data, { new: true });
    } else {
      doc = new TaskModel(data);
      await doc.save();
    }

    return this._mapToEntity(doc);
  }

  async findById(id) {
    const doc = await TaskModel.findById(id);
    return this._mapToEntity(doc);
  }

  async findByProjectId(projectId, { status, priority, search, assigneeId } = {}) {
    const query = { projectId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assigneeId) query.assigneeId = assigneeId === 'unassigned' ? null : assigneeId;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const docs = await TaskModel.find(query).sort({ createdAt: 1 });
    return docs.map(doc => this._mapToEntity(doc));
  }

  async deleteById(id) {
    await TaskModel.findByIdAndDelete(id);
  }

  async countAll() {
    return await TaskModel.countDocuments();
  }

  async countCompleted() {
    return await TaskModel.countDocuments({ status: 'Done' });
  }
}

module.exports = MongoTaskRepository;
