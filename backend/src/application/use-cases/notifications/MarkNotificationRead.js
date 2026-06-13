class MarkNotificationRead {
  constructor({ notificationRepository }) {
    this.notificationRepository = notificationRepository;
  }

  async execute({ notificationId, userId }) {
    return await this.notificationRepository.markAsRead(notificationId);
  }
}

module.exports = MarkNotificationRead;
