const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User.model');

const isAdminOrPoster = (Model) => {
  return async (req, res, next) => {
    const authorization = req.headers.authorization;
    const token = authorization.replace('Bearer ', '');
    const decodedJwt = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
    const { username } = decodedJwt;
    const user = await User.findOne({ username });
    req.user = user;
    const id = req.params.id;
    const foundModel = await Model.findById(id);
    let modelId = '';
    if (foundModel.user) {
      modelId = foundModel.user.toString();
    } else {
      modelId = foundModel._id.toString();
    }
    if (req.user.role === 'admin' || req.user._id.toString() === modelId)
      next();
    else res.status(403).json({ message: 'You are not authorized' });
  };
};

module.exports = isAdminOrPoster;
