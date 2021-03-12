const express = require('express');
const passport = require('passport');
const controller = require('../controllers/auth');

const router = express.Router();

router.post('/login', controller.login);
router.post('/replace-token', passport.authenticate('jwt', { session: false, failureRedirect: '/api/error-authenticate' }), controller.replaceToken);

module.exports = router;
