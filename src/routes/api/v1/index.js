const router = require('express').Router();

router.use('/healthCheck', require('./healthCheck'));

module.exports = router;
