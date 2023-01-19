const router = require('express').Router();
const AuthController = require('../../../controllers/v1/Auth.controller');
const auth = require('../../../utils/auth');

/**
 * /api/v1/auth/login
 */
 router.post('/login', AuthController.login);

 /**
 * /api/v1/user/logout
 */
router.post('/logout', 
auth.isAuth, 
AuthController.logout);

module.exports = router;