const authMiddlewareFactory = (tokenService) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = tokenService.verify(token);
      req.user = decoded; // Attach user payload: { id, email, role }
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token.' });
    }
  };
};

module.exports = authMiddlewareFactory;
