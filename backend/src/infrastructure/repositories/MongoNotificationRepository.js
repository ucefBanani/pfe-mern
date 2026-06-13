const NotificationRepository = require('../../domain/repositories/NotificationRepository');
const NotificationModel = require('../database/models/NotificationModel');
const Notification = require('../../domain/entities/Notification');

class MongoNotificationRepository extends NotificationRepository {
  _mapToEntity(doc) {
    if (!doc) return null;
    return new Notification({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      message: doc.message,
      isRead: doc.isRead,
      type: doc.type,
      createdAt: doc.createdAt
    });
  }

  async save(notificationEntity) {
    const data = {
      userId: notificationEntity.userId,
      message: notificationEntity.message,
      isRead: notificationEntity.isRead,
      type: notificationEntity.type
    };

    let doc;
    if (notificationEntity.id) {
      doc = await NotificationModel.findByIdAndUpdate(notificationEntity.id, data, { new: true });
    } else {
      doc = new NotificationModel(data);
      await doc.save();
    }

    return this._mapToEntity(doc);
  }

  async findByUserId(userId) {
    const docs = await NotificationModel.find({ userId }).sort({ createdAt: -1 }).limit(50);
    return docs.map(doc => this._mapToEntity(doc));
  }

  async markAsRead(id) {
    const doc = await NotificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true });
    return this._mapToEntity(doc);
  }

  async markAllAsRead(userId) {
    await NotificationModel.updateMany({ userId, isRead: false }, { isRead: true });
  }
}

module.exports = MongoNotificationRepository;
