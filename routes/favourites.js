const express = require('express');
const passport = require('passport');

const favourites = require('../controllers/favourites');

const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false, failureRedirect: '/api/error-authenticate' }), favourites.getAll);
router.get('/get-by-imdbid', passport.authenticate('jwt', { session: false, failureRedirect: '/api/error-authenticate' }), favourites.getById);
router.delete('/', passport.authenticate('jwt', { session: false, failureRedirect: '/api/error-authenticate' }), favourites.remove);
router.post('/', passport.authenticate('jwt', { session: false, failureRedirect: '/api/error-authenticate' }), favourites.update);
router.get('/is-movie-favourite', passport.authenticate('jwt', { session: false, failureRedirect: '/api/error-authenticate' }), favourites.checkIsMovieFavorite);

module.exports = router;
