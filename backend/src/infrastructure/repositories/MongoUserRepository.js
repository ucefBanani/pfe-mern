const UserRepository = require('../../domain/repositories/UserRepository');
const UserModel = require('../database/models/UserModel');
const User = require('../../domain/entities/User');

class MongoUserRepository extends UserRepository {
  _mapToEntity(doc) {
    if (!doc) return null;
    return new User({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      isVerified: doc.isVerified,
      verificationToken: doc.verificationToken,
      resetPasswordToken: doc.resetPasswordToken,
      createdAt: doc.createdAt
    });
  }

  async save(userEntity) {
    const data = {
      name: userEntity.name,
      email: userEntity.email,
      password: userEntity.password,
      role: userEntity.role,
      isVerified: userEntity.isVerified,
      verificationToken: userEntity.verificationToken,
      resetPasswordToken: userEntity.resetPasswordToken
    };

    let doc;
    if (userEntity.id) {
      doc = await UserModel.findByIdAndUpdate(userEntity.id, data, { new: true });
    } else {
      doc = new UserModel(data);
      await doc.save();
    }

    return this._mapToEntity(doc);
  }

  async findById(id) {
    const doc = await UserModel.findById(id);
    return this._mapToEntity(doc);
  }

  async findByEmail(email) {
    const doc = await UserModel.findOne({ email: email.toLowerCase() });
    return this._mapToEntity(doc);
  }

  async findByVerificationToken(token) {
    const doc = await UserModel.findOne({ verificationToken: token });
    return this._mapToEntity(doc);
  }

  async findByResetPasswordToken(token) {
    const doc = await UserModel.findOne({ resetPasswordToken: token });
    return this._mapToEntity(doc);
  }

  async findAll() {
    const docs = await UserModel.find().sort({ createdAt: -1 });
    return docs.map(doc => this._mapToEntity(doc));
  }

  async countAll() {
    return await UserModel.countDocuments();
  }
}

module.exports = MongoUserRepository;
