const nodemailer = require('nodemailer');
const IMailService = require('../../application/services/IMailService');

class NodemailerMailService extends IMailService {
  constructor(config) {
    super();
    this.config = config;
    this.transporter = null;

    if (config.host && config.port) {
      this.transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        auth: (config.user && config.pass) ? {
          user: config.user,
          pass: config.pass
        } : null
      });
    }
  }

  async sendVerificationEmail(email, token) {
    const verificationUrl = `http://localhost:5173/verify-email?token=${token}`;
    console.log('\n==================================================');
    console.log(`[MAIL MOCK] Verification email sent to: ${email}`);
    console.log(`Verification URL: ${verificationUrl}`);
    console.log('==================================================\n');

    if (this.transporter) {
      const mailOptions = {
        from: this.config.from,
        to: email,
        subject: 'TaskFlow AI - Verify Your Email',
        html: `
          <h1>Welcome to TaskFlow AI</h1>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verificationUrl}" target="_blank">Verify Email</a>
          <br><br>
          <p>If you did not request this, please ignore this email.</p>
        `
      };
      await this.transporter.sendMail(mailOptions);
    }
  }

  async sendResetPasswordEmail(email, token) {
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
    console.log('\n==================================================');
    console.log(`[MAIL MOCK] Reset Password email sent to: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('==================================================\n');

    if (this.transporter) {
      const mailOptions = {
        from: this.config.from,
        to: email,
        subject: 'TaskFlow AI - Reset Password Request',
        html: `
          <h1>Reset Password</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" target="_blank">Reset Password</a>
          <br><br>
          <p>This link is valid for 1 hour. If you did not request this, please ignore this email.</p>
        `
      };
      await this.transporter.sendMail(mailOptions);
    }
  }
}

module.exports = NodemailerMailService;
