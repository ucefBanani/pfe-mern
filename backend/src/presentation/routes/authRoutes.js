const express = require('express');
const { body } = require('express-validator');
const { validateFields } = require('../middlewares/validationMiddleware');

const authRoutesFactory = (authController, authMiddleware) => {
  const router = express.Router();

  router.post('/register', [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    validateFields
  ], (req, res, next) => authController.register(req, res, next));

  router.get('/verify-email/:token', (req, res, next) => authController.verify(req, res, next));

  router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required.'),
    validateFields
  ], (req, res, next) => authController.login(req, res, next));

  router.post('/forgot-password', [
    body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
    validateFields
  ], (req, res, next) => authController.forgot(req, res, next));

  router.put('/reset-password/:token', [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    validateFields
  ], (req, res, next) => authController.reset(req, res, next));

  router.get('/me', authMiddleware, (req, res, next) => authController.me(req, res, next));

  return router;
};

module.exports = authRoutesFactory;
