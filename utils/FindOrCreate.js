const User = require('../models/user');

module.exports = async (input) => {
  const user = await User.findOne({ email: input.email });
  if (user) {
    return user;
  // eslint-disable-next-line no-else-return
  } else {
    const newUser = await new User(input).save();
    return newUser;
  }
};
