const User = require('../../../domain/entities/User');
const crypto = require('crypto');

class RegisterUser {
  constructor({ userRepository, hashService, mailService }) {
    this.userRepository = userRepository;
    this.hashService = hashService;
    this.mailService = mailService;
  }

  async execute({ name, email, password }) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email.');
    }

    const hashedPassword = await this.hashService.hash(password);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken
    });

    user.validate();

    const savedUser = await this.userRepository.save(user);

    // Send verification email in background
    this.mailService.sendVerificationEmail(email, verificationToken).catch(err => {
      console.error('Failed to send verification email:', err.message);
    });

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      isVerified: savedUser.isVerified
    };
  }
}

module.exports = RegisterUser;
