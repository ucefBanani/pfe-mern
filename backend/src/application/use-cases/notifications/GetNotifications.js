class GetNotifications {
  constructor({ notificationRepository }) {
    this.notificationRepository = notificationRepository;
  }

  async execute({ userId }) {
    return await this.notificationRepository.findByUserId(userId);
  }
}

module.exports = GetNotifications;
