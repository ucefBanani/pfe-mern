const crypto = require('crypto');

class ForgotPassword {
  constructor({ userRepository, mailService }) {
    this.userRepository = userRepository;
    this.mailService = mailService;
  }

  async execute({ email }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('No user found with this email.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    await this.userRepository.save(user);

    // Send reset password email in background
    this.mailService.sendResetPasswordEmail(email, resetToken).catch(err => {
      console.error('Failed to send password reset email:', err.message);
    });

    return {
      success: true,
      message: 'Password reset link sent to email.'
    };
  }
}

module.exports = ForgotPassword;
