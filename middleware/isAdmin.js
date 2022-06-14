const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User.model');

const isAdmin = async (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization.replace('Bearer ', '');
  const decodedJwt = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
  const { username } = decodedJwt;
  const user = await User.findOne({ username });
  req.user = user;
  if (req.user.role === 'admin') next();
  else res.status(403).json({ message: 'You are not authorized' });
};

module.exports = isAdmin;
