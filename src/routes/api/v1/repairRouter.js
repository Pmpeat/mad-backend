const router = require('express').Router();
const RepairController = require('../../../controllers/v1/Repair.controller');

/**
 * /api/v1/repair/find
 * */
router.post('/find', RepairController.getAllRepair);

/**
 * /api/v1/repair/update
 * */
router.post('/update', RepairController.updateRepairStatus);


module.exports = router;
