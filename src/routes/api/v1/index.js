const router = require('express').Router();

router.use('/healthCheck', require('./healthCheck'));
router.use('/applicant', require('./applicant'));

module.exports = router;
