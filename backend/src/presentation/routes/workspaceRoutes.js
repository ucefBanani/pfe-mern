const express = require('express');
const { body } = require('express-validator');
const { validateFields } = require('../middlewares/validationMiddleware');

const workspaceRoutesFactory = (workspaceController, authMiddleware) => {
  const router = express.Router();

  router.use(authMiddleware);

  router.post('/', [
    body('name').trim().notEmpty().withMessage('Workspace name is required.'),
    validateFields
  ], (req, res, next) => workspaceController.create(req, res, next));

  router.get('/', (req, res, next) => workspaceController.list(req, res, next));

  router.post('/:workspaceId/members', [
    body('email').isEmail().withMessage('Valid user email to invite is required.').normalizeEmail(),
    body('role').optional().isIn(['Admin', 'Member']).withMessage('Role must be either Admin or Member.'),
    validateFields
  ], (req, res, next) => workspaceController.addMember(req, res, next));

  router.get('/:workspaceId/members', (req, res, next) => workspaceController.getMembers(req, res, next));

  return router;
};

module.exports = workspaceRoutesFactory;
