class User {
  constructor({ id, name, email, password, role = 'User', isVerified = false, verificationToken = null, resetPasswordToken = null, createdAt = new Date() } = {}) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role; // 'Admin' | 'User'
    this.isVerified = isVerified;
    this.verificationToken = verificationToken;
    this.resetPasswordToken = resetPasswordToken;
    this.createdAt = createdAt;
  }

  validate() {
    if (!this.name || this.name.trim() === '') {
      throw new Error('User name is required.');
    }
    if (!this.email || !this.email.includes('@')) {
      throw new Error('Valid email is required.');
    }
    if (!this.password || this.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
  }

  verify() {
    this.isVerified = true;
    this.verificationToken = null;
  }
}

module.exports = User;
