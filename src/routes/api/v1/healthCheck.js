const router = require('express').Router();
const healthController = require('../../../controllers/v1/healthCheck.controller');

/**
 * /api/v1/healthCheck/status
 * */
router.get('/status', healthController.healthCheck);

module.exports = router;
