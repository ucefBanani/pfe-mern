const express = require('express');
const roleMiddleware = require('../middlewares/roleMiddleware');

const adminRoutesFactory = (adminController, authMiddleware) => {
  const router = express.Router();

  router.use(authMiddleware);
  router.use(roleMiddleware(['Admin']));

  router.get('/metrics', (req, res, next) => adminController.getMetrics(req, res, next));

  return router;
};

module.exports = adminRoutesFactory;
