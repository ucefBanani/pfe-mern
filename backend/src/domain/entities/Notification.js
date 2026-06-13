class Notification {
  constructor({ id, userId, message, isRead = false, type = 'info', createdAt = new Date() } = {}) {
    this.id = id;
    this.userId = userId;
    this.message = message;
    this.isRead = isRead;
    this.type = type; // 'info' | 'alert' | 'task'
    this.createdAt = createdAt;
  }

  validate() {
    if (!this.userId) {
      throw new Error('User association is required.');
    }
    if (!this.message || this.message.trim() === '') {
      throw new Error('Notification message is required.');
    }
  }

  markAsRead() {
    this.isRead = true;
  }
}

module.exports = Notification;
