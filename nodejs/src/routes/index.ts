import { Router } from "express";

const router : Router = require('express').Router();

router.use('/api', require('./api'));

module.exports = router;