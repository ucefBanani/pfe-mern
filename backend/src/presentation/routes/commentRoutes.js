const express = require('express');
const { body } = require('express-validator');
const { validateFields } = require('../middlewares/validationMiddleware');

const commentRoutesFactory = (commentController, authMiddleware) => {
  const router = express.Router();

  router.use(authMiddleware);

  router.post('/', [
    body('taskId').notEmpty().withMessage('taskId is required.'),
    body('content').trim().notEmpty().withMessage('Comment content cannot be empty.'),
    validateFields
  ], (req, res, next) => commentController.create(req, res, next));

  router.get('/', (req, res, next) => commentController.list(req, res, next));

  return router;
};

module.exports = commentRoutesFactory;
