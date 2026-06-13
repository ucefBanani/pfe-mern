const bcrypt = require('bcryptjs');
const IHashService = require('../../application/services/IHashService');

class BcryptHashService extends IHashService {
  async hash(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async compare(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = BcryptHashService;
