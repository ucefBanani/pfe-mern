const express = require('express');
const { body } = require('express-validator');
const { validateFields } = require('../middlewares/validationMiddleware');

const taskRoutesFactory = (taskController, authMiddleware) => {
  const router = express.Router();

  router.use(authMiddleware);

  router.post('/', [
    body('projectId').notEmpty().withMessage('projectId is required.'),
    body('title').trim().notEmpty().withMessage('Task title is required.'),
    validateFields
  ], (req, res, next) => taskController.create(req, res, next));

  router.get('/', (req, res, next) => taskController.list(req, res, next));

  router.put('/:id', (req, res, next) => taskController.update(req, res, next));

  router.delete('/:id', (req, res, next) => taskController.delete(req, res, next));

  // AI-Assisted Routes
  router.post('/suggest-priority', [
    body('title').trim().notEmpty().withMessage('Task title is required to suggest priority.'),
    validateFields
  ], (req, res, next) => taskController.suggestPriority(req, res, next));

  router.post('/suggest-description', [
    body('title').trim().notEmpty().withMessage('Task title is required to suggest description.'),
    validateFields
  ], (req, res, next) => taskController.suggestDescription(req, res, next));

  router.post('/estimate-complexity', [
    body('title').trim().notEmpty().withMessage('Task title is required to estimate complexity.'),
    validateFields
  ], (req, res, next) => taskController.estimateComplexity(req, res, next));

  router.get('/weekly-report/:workspaceId', (req, res, next) => taskController.getWeeklyReport(req, res, next));

  return router;
};

module.exports = taskRoutesFactory;
