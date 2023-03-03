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

/**
 * /api/v1/order/create-request-order
 * */
router.post('/create-request-order', async (req ,res) => {
    try {
        const resultQuery = await OrderController.createUserRequestOrder(req ,res);
        
        if(resultQuery === "success"){
            res.redirect("/success-request");
            
        } else {
            console.log("error =>>> ");
            res.redirect("/false-request");
        }
        
    } catch (err) {
        res.status(500).end();
    }
});

module.exports = router;
