class AuthController {
  constructor({ registerUser, verifyEmail, loginUser, forgotPassword, resetPassword, userRepository }) {
    this.registerUser = registerUser;
    this.verifyEmail = verifyEmail;
    this.loginUser = loginUser;
    this.forgotPassword = forgotPassword;
    this.resetPassword = resetPassword;
    this.userRepository = userRepository;
  }

  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await this.registerUser.execute({ name, email, password });
      res.status(201).json(result);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  async verify(req, res, next) {
    try {
      const { token } = req.params;
      const result = await this.verifyEmail.execute({ token });
      res.status(200).json(result);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await this.loginUser.execute({ email, password });
      res.status(200).json(result);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  async forgot(req, res, next) {
    try {
      const { email } = req.body;
      const result = await this.forgotPassword.execute({ email });
      res.status(200).json(result);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  async reset(req, res, next) {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const result = await this.resetPassword.execute({ token, newPassword: password });
      res.status(200).json(result);
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      const user = await this.userRepository.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      });
    } catch (error) {
      res.status(400);
      next(error);
    }
  }
}

module.exports = AuthController;
