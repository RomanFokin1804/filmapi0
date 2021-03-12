/* eslint-disable newline-per-chained-call */
/* eslint-disable no-useless-escape */
/* eslint-disable no-restricted-syntax */
const Joi = require('joi');
const errorHandler = require('../utils/errorHandler');
const User = require('../models/user');

/* module.exports.getAll = async (req, res) => {
  try {
    // console.log('USER GET: ', req.user[0]);
    const user = await User.find({ email: req.user[0].email });
    // console.log('USER: ', user);
    res.status(200).json(user[0].favourites);
  } catch (e) {
    errorHandler(res, e);
  }
}; */

module.exports.getAll = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const user = await User.find({ email: req.user[0].email });
    const favouritesList = user[0].favourites;
    const count = favouritesList.length;
    const totalPages = Math.ceil(count / limit);
    if (count === 0) {
      res.status(200).json({
        count: 0,
        next: null,
        previous: null,
        results: [],
      });
      return;
    }
    const schema = Joi.object().keys({
      page: Joi.number().min(1).max(totalPages).integer(),
      limit: Joi.number().min(1).integer(),
    });
    const query = schema.validate({ page, limit });
    if (query.error) {
      const queryError = query.error.details[0].message.split('"');
      res.status(400).json({ message: `${queryError[1]}${queryError[2]}` });
      return;
    }
    let next = '';
    let previous = '';
    if (Number(page) === totalPages) {
      next = null;
    } else {
      next = `https://filmapi0.herokuapp.com/api/favourites/?page=${page * 1 + 1 * 1}&limit=${limit}`;
    }
    if (Number(page) === 1) {
      previous = null;
    } else {
      previous = `https://filmapi0.herokuapp.com/api/favourites/?page=${page - 1}&limit=${limit}`;
    }
    const startList = (page - 1) * limit;
    const endList = (page - 1) * limit + limit * 1;
    const listOfFavourites = favouritesList.slice(startList, endList);
    res.status(200).json({
      count,
      next,
      previous,
      results: listOfFavourites,
    });
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getById = async (req, res) => {
  try {
    const schema = Joi.object().keys({
      imdbID: Joi.string().trim().pattern(/^(t{2}[0-9]{7})$/, 'imdbID').message('\"imdbID\" must be in the format tt0000000').required(),
    });
    const query = schema.validate({ imdbID: req.query.imdbID });
    if (query.error) {
      const queryError = query.error.details[0].message.split('"');
      res.status(400).json({
        status: false,
        message: `${queryError[1]}${queryError[2]}`,
      });
      return;
    }
    const user = await User.find({ email: req.user[0].email });
    const favouritesList = user[0].favourites;
    let getFavourites;
    for (const key in favouritesList) {
      if (favouritesList[key].imdbID === req.query.imdbID) {
        getFavourites = favouritesList[key];
      }
    }
    res.status(200).json(getFavourites);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.remove = async (req, res) => {
  try {
    const schema = Joi.object().keys({
      imdbID: Joi.string().trim().pattern(/^(t{2}[0-9]{7})$/, 'imdbID').message('\"imdbID\" must be in the format tt0000000').required(),
    });
    const query = schema.validate({ imdbID: req.query.imdbID });
    if (query.error) {
      const queryError = query.error.details[0].message.split('"');
      res.status(400).json({
        status: false,
        message: `${queryError[1]}${queryError[2]}`,
      });
      return;
    }
    const user = await User.find({ email: req.user[0].email });
    const favouritesList = user[0].favourites;
    let status = '';
    for (const key in favouritesList) {
      if (favouritesList[key].imdbID === req.query.imdbID) {
        user[0].favourites[key].remove();
        status = true;
      }
    }
    user[0].save();
    if (status !== true) {
      status = false;
    }
    res.status(200).json({ status });
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.update = async (req, res) => {
  try {
    const schema = Joi.object().keys({
      title: Joi.string().trim().required(),
      genre: Joi.string().trim().required(),
      released: Joi.string().trim().isoDate().required(),
      runtime: Joi.string().trim().required(),
      imdbRating: Joi.string().trim().pattern(/^([0-9]{1}\.{1}[0-9]{1})$/, 'numbers and dot').message('\"imdbRating\" must be in the format number.number , example: 7.4').required(),
      plot: Joi.string().trim().required(),
      poster: Joi.string().trim().uri().required(),
      country: Joi.string().trim().required(),
      imdbID: Joi.string().trim().pattern(/^(t{2}[0-9]{7})$/, 'imdbID').message('\"imdbID\" must be in the format tt0000000').required(),
      year: Joi.string().trim().length(4).pattern(/^((([1]{1}[89]{1})|([2]{1}[0]{1}))[0-9]{2})$/, 'numbers').message('\"year\" must be a number').required(),
    });
    const updatedData = schema.validate(req.body);
    if (updatedData.error) {
      const datError = updatedData.error.details[0].message.split('"');
      console.log(`${datError[1]}${datError[2]}`);
      res.status(400).json({
        status: false,
        message: `${datError[1]}${datError[2]}`,
      });
      return;
    }

    const user = await User.find({ email: req.user[0].email });
    const favouritesList = user[0].favourites;
    for (const key in favouritesList) {
      if (favouritesList[key].imdbID === req.body.imdbID) {
        res.status(409).json({
          status: false,
          message: 'This film has alredy in cathegory favourites',
        });
        return;
      }
    }
    await User.findOneAndUpdate(
      { email: req.user[0].email },
      { $push: { favourites: updatedData.value } },
      { new: true },
    );
    res.status(200).json({
      status: true,
    });
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.checkIsMovieFavorite = async (req, res) => {
  try {
    const schema = Joi.object().keys({
      imdbID: Joi.string().trim().pattern(/^(t{2}[0-9]{7})$/, 'imdbID').message('\"imdbID\" must be in the format tt0000000').required(),
    });
    const query = schema.validate({ imdbID: req.query.imdbID });
    if (query.error) {
      const queryError = query.error.details[0].message.split('"');
      res.status(400).json({
        status: false,
        message: `${queryError[1]}${queryError[2]}`,
      });
      return;
    }
    const user = await User.find({ email: req.user[0].email });
    const favouritesList = user[0].favourites;
    for (const key in favouritesList) {
      if (favouritesList[key].imdbID === req.query.imdbID) {
        res.status(200).json({
          status: true,
        });
        return;
      }
    }
    res.status(200).json({
      status: false,
    });
  } catch (e) {
    errorHandler(res, e);
  }
};
