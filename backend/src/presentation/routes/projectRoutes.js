const express = require('express');
const { body } = require('express-validator');
const { validateFields } = require('../middlewares/validationMiddleware');

const projectRoutesFactory = (projectController, authMiddleware) => {
  const router = express.Router();

  router.use(authMiddleware);

  router.post('/', [
    body('name').trim().notEmpty().withMessage('Project name is required.'),
    body('workspaceId').notEmpty().withMessage('workspaceId is required.'),
    validateFields
  ], (req, res, next) => projectController.create(req, res, next));

  router.get('/', (req, res, next) => projectController.list(req, res, next));

  router.get('/:id/ai-summary', (req, res, next) => projectController.getAISummary(req, res, next));

  return router;
};

module.exports = projectRoutesFactory;
