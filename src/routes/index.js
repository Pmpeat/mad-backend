const router = require('express').Router();

router.use('/v1', require('./api/v1'));

module.exports = router;
