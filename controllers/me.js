const errorHandler = require('../utils/errorHandler');

module.exports.me = async (req, res) => {
  try {
    if (req.user[0].email) {
      res.status(200).json({
        name: req.user[0].name,
        email: req.user[0].email,
        avatar: req.user[0].avatar,
      });
    } else {
      res.status(400).json({
        message: 'User not existence',
      });
    }
  } catch (e) {
    errorHandler(res, e);
  }
};
