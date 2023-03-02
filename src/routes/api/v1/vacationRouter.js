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
router.post('/create-request-vacation', vacationController.createUserRequestVacation);


module.exports = router;
