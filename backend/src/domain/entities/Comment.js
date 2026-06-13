class Comment {
  constructor({ id, taskId, userId, content, createdAt = new Date() } = {}) {
    this.id = id;
    this.taskId = taskId;
    this.userId = userId;
    this.content = content;
    this.createdAt = createdAt;
  }

  validate() {
    if (!this.taskId) {
      throw new Error('Task association is required.');
    }
    if (!this.userId) {
      throw new Error('User association is required.');
    }
    if (!this.content || this.content.trim() === '') {
      throw new Error('Comment content is required.');
    }
  }
}

module.exports = Comment;
