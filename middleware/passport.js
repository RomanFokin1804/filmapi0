/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = mongoose.model('users');
const accessTokenDB = require('../models/accessToken');

const config = require('../config/config');

const { keys } = config;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwt,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await User.find({ email: payload.email });
        if (user) {
          const findAccessToken = await accessTokenDB.findOne({
            userId: user[0]._id,
          });
          if (findAccessToken) {
            const decodedToken = jwt.verify(findAccessToken.token, keys.jwt);
            if (decodedToken.time === payload.time) {
              done(null, user);
            } else {
              done(null, false);
            }
          } else {
            done(null, false);
          }
        } else {
          done(null, false);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }),
  );
};
