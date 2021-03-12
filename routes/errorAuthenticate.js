const express = require('express');
const controller = require('../controllers/errorAuthenticate');

const router = express.Router();

router.get('/', controller.error);

module.exports = router;
