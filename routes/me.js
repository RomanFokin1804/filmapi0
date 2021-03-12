const express = require('express');
const passport = require('passport');

const me = require('../controllers/me');

const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false, failureRedirect: '/api/error-authenticate' }), me.me);

module.exports = router;
