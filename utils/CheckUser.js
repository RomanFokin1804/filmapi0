const User = require('../models/user');

module.exports = async (input) => {
  const user = await User.findOne({ email: input.email });
  if (user) {
    return true;
  // eslint-disable-next-line no-else-return
  } else {
    return false;
  }
};
