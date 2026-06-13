class LoginUser {
  constructor({ userRepository, hashService, tokenService }) {
    this.userRepository = userRepository;
    this.hashService = hashService;
    this.tokenService = tokenService;
  }

  async execute({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    if (!user.isVerified) {
      throw new Error('Please verify your email before logging in.');
    }

    const isMatch = await this.hashService.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = this.tokenService.generate(
      { id: user.id, email: user.email, role: user.role },
      '7d'
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}

module.exports = LoginUser;
