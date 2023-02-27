const router = require('express').Router();

router.use('/healthCheck', require('./healthCheck'));
router.use('/applicant', require('./applicantRouter'));
router.use('/auth', require('./authRouter'));
router.use('/review', require('./reviewRouter'));
router.use('/user', require('./userRouter'));
router.use('/line', require('./lineRouter'));
router.use('/repair', require('./repairRouter'));
router.use('/order', require('./orderRouter'));
router.use('/view', require('./htmlRouter'));

module.exports = router;
