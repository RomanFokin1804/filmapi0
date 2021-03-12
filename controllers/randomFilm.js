const errorHandler = require('../utils/errorHandler');
const topFilms = require('../utils/topFilms');

module.exports.getRandomTopFilm = async (req, res) => {
  try {
    const getIdFilms = await topFilms();
    res.status(200).json({
      imdbID: getIdFilms,
    });
  } catch (e) {
    errorHandler(res, e);
  }
};
