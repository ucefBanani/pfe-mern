class ResetPassword {
  constructor({ userRepository, hashService }) {
    this.userRepository = userRepository;
    this.hashService = hashService;
  }

  async execute({ token, newPassword }) {
    if (!token) {
      throw new Error('Reset token is required.');
    }
    if (!newPassword || newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    const user = await this.userRepository.findByResetPasswordToken(token);
    if (!user) {
      throw new Error('Invalid or expired password reset token.');
    }

    const hashedPassword = await this.hashService.hash(newPassword);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    await this.userRepository.save(user);

    return {
      success: true,
      message: 'Password has been reset successfully.'
    };
  }
}

module.exports = ResetPassword;
