class IMailService {
  async sendVerificationEmail(email, token) { throw new Error('Method not implemented.'); }
  async sendResetPasswordEmail(email, token) { throw new Error('Method not implemented.'); }
}

module.exports = IMailService;
