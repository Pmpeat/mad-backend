const router = require('express').Router();
const OrderController = require('../../../controllers/v1/Order.controller');

/**
 * /api/v1/order/find
 * */
router.post('/find', OrderController.getAllOrderr);

/**
 * /api/v1/order/update
 * */
router.post('/update', OrderController.updateOrderStatus);


module.exports = router;
