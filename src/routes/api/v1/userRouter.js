const router = require('express').Router();
const userController = require('../../../controllers/v1/User.controller');


/**
 * /api/v1/user/create-user
 * */
router.post('/create-user', userController.createApplicant);


/**
 * /api/v1/user/user-list
 * */
router.get("/user-list", userController.getUserList);

module.exports = router;
