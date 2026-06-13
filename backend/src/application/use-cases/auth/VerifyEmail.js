class VerifyEmail {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async execute({ token }) {
    if (!token) {
      throw new Error('Verification token is required.');
    }

    const user = await this.userRepository.findByVerificationToken(token);
    if (!user) {
      throw new Error('Invalid or expired verification token.');
    }

    user.verify();
    await this.userRepository.save(user);

    return {
      success: true,
      message: 'Email successfully verified.'
    };
  }
}

module.exports = VerifyEmail;
