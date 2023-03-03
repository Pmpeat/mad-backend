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

/**
 * /api/v1/repair/create-request-repair
 * */
// router.post('/create-request-repair', RepairController.createUserRequestRepair);
router.post('/create-request-repair', async (req ,res) => {
    try {
        const resultQuery = await RepairController.createUserRequestRepair(req ,res);
        console.log("resultQuery");
        if(!_.isNull(resultQuery)){
            
            res.send("<html> <head>server Response</head><body><h1> This page was render direcly from the server <p>Hello there welcome to my website</p></h1></body></html>");
        } else {
            console.log("error =>>> ");
        }
        
    } catch (err) {
        res.status(500).end();
    }
});




module.exports = router;
