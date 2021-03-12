module.exports.error = async (req, res) => {
  res.status(401).json({ message: 'Unauthorized' });
};
