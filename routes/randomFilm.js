const express = require('express');

const randomFilm = require('../controllers/randomFilm');

const router = express.Router();

router.get('/', randomFilm.getRandomTopFilm);

module.exports = router;
