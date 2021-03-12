const config = {};

config.oauth = {
  googleAuth: {
    clientID: 'clientID',
    clientSecret: 'clientSecret',
    callbackURL: 'callbackURL',
  },
};

config.keys = {
  mongoURI: 'mongoURI',
  jwt: 'secret',
  jwtRefresh: 'secret',
};
module.exports = config;
