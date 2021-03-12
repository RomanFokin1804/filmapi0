/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const request = require('request');
const { keys, oauth } = require('../config/config');

const FindOrCreate = require('../utils/FindOrCreate');
const errorHandler = require('../utils/errorHandler');
const accessTokenDB = require('../models/accessToken');
const refreshTokenDB = require('../models/refreshToken');
const User = require('../models/user');

module.exports.login = async (req, res) => {
  try {
    const { code } = req.body;
    const urlPOST = 'https://oauth2.googleapis.com/token';
    const payload = {
      client_id: oauth.googleAuth.clientID,
      client_secret: oauth.googleAuth.clientSecret,
      redirect_uri: req.body.redirect_uri,
      code,
      grant_type: 'authorization_code',
    };
    await request({
      method: 'POST',
      url: urlPOST,
      form: payload,
    },
    async (errorPOST, responsePOST, bodyPOST) => {
      const parsedBodyPOST = JSON.parse(bodyPOST);
      if (parsedBodyPOST.access_token) {
        // const baseUrl = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=';
        const baseUrl = 'https://oauth2.googleapis.com/tokeninfo?id_token=';
        // const accessTokenR = bodyPOST.access_token;
        const idToken = parsedBodyPOST.id_token;
        // const urlGET = baseUrl + accessTokenR;
        const urlGET = baseUrl + idToken;
        await request({
          method: 'GET',
          url: urlGET,
        },
        async (errorGET, responseGET, bodyGET) => {
          if (errorGET && !(responseGET.statusCode === 200)) {
            res.status(403).json({ message: 'Authorization failed' });
            return;
          }
          const parsedBodyGET = JSON.parse(bodyGET);
          if (parsedBodyGET.email) {
            const user = {
              email: parsedBodyGET.email,
              name: parsedBodyGET.name,
              avatar: parsedBodyGET.picture,
            };
            const time = new Date();
            const accessToken = jwt.sign({
              email: user.email,
              time: `${time.getDate()}.${time.getMonth() + 1}.${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`,
            },
            keys.jwt,
            { expiresIn: 24 * 60 * 60 });
            const refreshToken = jwt.sign({
              email: user.email,
              time: `${time.getDate()}.${time.getMonth() + 1}.${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`,
            },
            keys.jwtRefresh,
            { expiresIn: 7 * 24 * 60 * 60 });
            const findOrCreatedUser = await FindOrCreate(user);
            const findRefreshToken = await refreshTokenDB.findOne({
              userId: findOrCreatedUser._id,
            });
            if (findRefreshToken) {
              await accessTokenDB.findOneAndDelete({ userId: findOrCreatedUser._id });
              await accessTokenDB.create({ userId: findOrCreatedUser._id, token: accessToken });
              await refreshTokenDB.findOneAndDelete({ userId: findOrCreatedUser._id });
              await refreshTokenDB.create({ userId: findOrCreatedUser._id, token: refreshToken });
            } else {
              await accessTokenDB.create({ userId: findOrCreatedUser._id, token: accessToken });
              await refreshTokenDB.create({ userId: findOrCreatedUser._id, token: refreshToken });
            }
            res.status(200).json({
              email: user.email,
              name: user.name,
              avatar: user.avatar,
              accessToken,
              refreshToken,
            });
          } else {
            res.status(403).json({ message: 'Authorization failed, this email does not exist' });
            return;
          }
        });
      } else {
        res.status(403).json({ message: 'Authorization failed' });
        return;
      }
    });
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.replaceToken = async (req, res) => {
  try {
    const findRefreshToken = await refreshTokenDB.findOne({ token: req.body.refreshToken });
    const findUser = await User.findOne({ _id: findRefreshToken.userId });
    const time = new Date();
    const accessToken = jwt.sign({
      email: findUser.email,
      time: `${time.getDate()}.${time.getMonth() + 1}.${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`,
    },
    keys.jwt,
    { expiresIn: 24 * 60 * 60 });
    const refreshToken = jwt.sign({
      email: findUser.email,
      time: `${time.getDate()}.${time.getMonth() + 1}.${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`,
    },
    keys.jwtRefresh,
    { expiresIn: 7 * 24 * 60 * 60 });
    if (findRefreshToken) {
      await accessTokenDB.findOneAndDelete({ userId: findUser._id });
      await accessTokenDB.create({ userId: findUser._id, token: accessToken });
      await refreshTokenDB.findOneAndDelete({ userId: findUser._id });
      await refreshTokenDB.create({ userId: findUser._id, token: refreshToken });
    } else {
      res.status(400).json({ message: 'User not find' });
      return;
    }
    res.status(200).json({
      email: findUser.email,
      name: findUser.name,
      avatar: findUser.avatar,
      accessToken,
      refreshToken,
    });
  } catch (e) {
    errorHandler(res, e);
  }
};
