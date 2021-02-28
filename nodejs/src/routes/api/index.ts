var router = require('express').Router();

router.use('/schedule', require('./schedule'));
router.use('/record', require('./record'));

module.exports = router;