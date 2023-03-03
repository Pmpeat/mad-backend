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
router.post('/create-request-repair', async (req ,res) => {
    try {
        const resultQuery = await RepairController.createUserRequestRepair(req ,res);
        
        if(resultQuery === "success"){
            res.redirect("/success-request");
            
        } else {
            console.log("error =>>> ");
            res.redirect("/success-request");
        }
        
    } catch (err) {
        res.status(500).end();
    }
});




module.exports = router;
