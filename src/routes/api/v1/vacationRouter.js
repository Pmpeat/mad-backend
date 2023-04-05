const router = require('express').Router();
const vacationController = require('../../../controllers/v1/Vacation.controller');
const auth = require('../../../utils/auth');

/**
 * /api/v1/vacation/update-vacation
 * */
router.post('/update-vacation',auth.isAuth, vacationController.updateUserVacation);

/**
 * /api/v1/vacation/create-request-vacation/{type}
 * */
router.post('/create-request-vacation', async (req ,res) => {
    try {
        const resultQuery = await vacationController.createUserRequestVacation(req ,res);
        
        if(resultQuery === "success"){
            res.redirect("/success-request");
            
        } else if (resultQuery === "remain"){
            res.redirect("/false-remain");
        } else {
            res.redirect("/false-request");
        }
        
    } catch (err) {
        res.status(500).end();
    }
});

/**
 * /api/v1/vacation/reject-request-vacation
 * */
router.post('/reject-request-vacation', async (req ,res) => {
    try {
        const resultQuery = await vacationController.rejectRequestVacationStatus(req ,res);
        
        if(resultQuery === "success"){
            res.redirect("/success-reject");
            
        } else if (resultQuery === "remain"){
            res.redirect("/false-reject");
        } else {
            res.redirect("/false-request");
        }
        
    } catch (err) {
        res.status(500).end();
    }
});


/**
 * /api/v1/vacation/find
 * */
router.post('/find', vacationController.getRequestVacation);


/**
 * /api/v1/vacation/update-status-request
 * */
router.post('/update-status-request', vacationController.updateUserRequestVacationStatus);

module.exports = router;
