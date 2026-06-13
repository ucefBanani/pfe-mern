class UserRepository {
  async save(user) { throw new Error('Method not implemented.'); }
  async findById(id) { throw new Error('Method not implemented.'); }
  async findByEmail(email) { throw new Error('Method not implemented.'); }
  async findByVerificationToken(token) { throw new Error('Method not implemented.'); }
  async findByResetPasswordToken(token) { throw new Error('Method not implemented.'); }
  async findAll() { throw new Error('Method not implemented.'); }
  async countAll() { throw new Error('Method not implemented.'); }
}

module.exports = UserRepository;
