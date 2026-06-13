const jwt = require('jsonwebtoken');
const ITokenService = require('../../application/services/ITokenService');

class JwtTokenService extends ITokenService {
  constructor(secret) {
    super();
    this.secret = secret;
  }

  generate(payload, expiresIn = '7d') {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  verify(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid or expired token.');
    }
  }
}

module.exports = JwtTokenService;
