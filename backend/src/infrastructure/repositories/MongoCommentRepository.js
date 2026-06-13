const CommentRepository = require('../../domain/repositories/CommentRepository');
const CommentModel = require('../database/models/CommentModel');
const Comment = require('../../domain/entities/Comment');

class MongoCommentRepository extends CommentRepository {
  _mapToEntity(doc) {
    if (!doc) return null;
    const comment = new Comment({
      id: doc._id.toString(),
      taskId: doc.taskId.toString(),
      userId: doc.userId._id ? doc.userId._id.toString() : doc.userId.toString(),
      content: doc.content,
      createdAt: doc.createdAt
    });

    if (doc.userId && doc.userId.name) {
      comment.userName = doc.userId.name;
    }

    return comment;
  }

  async save(commentEntity) {
    const data = {
      taskId: commentEntity.taskId,
      userId: commentEntity.userId,
      content: commentEntity.content
    };

    let doc;
    if (commentEntity.id) {
      doc = await CommentModel.findByIdAndUpdate(commentEntity.id, data, { new: true });
    } else {
      doc = new CommentModel(data);
      await doc.save();
    }

    // Populate for response
    await doc.populate('userId', 'name');

    return this._mapToEntity(doc);
  }

  async findByTaskId(taskId) {
    const docs = await CommentModel.find({ taskId }).populate('userId', 'name').sort({ createdAt: 1 });
    return docs.map(doc => this._mapToEntity(doc));
  }

  async deleteById(id) {
    await CommentModel.findByIdAndDelete(id);
  }
}

module.exports = MongoCommentRepository;
