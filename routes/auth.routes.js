const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/User.model');
const router = require('express').Router();
const saltRounds = 10;

///Creat User
router.post('/signup', async (req, res, next) => {
  try {
    const { username, password, email, role } = req.body;

    if (!username || typeof username !== 'string') {
      res.status(400).json({ message: 'Please enter a valid username.' });
      return;
    }

    const foundUser = await User.findOne({ username });
    if (foundUser) {
      res
        .status(401)
        .json({ message: 'Username already exists. Try logging in instead.' });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      res.status(400).json({
        message: 'Please enter a valid password of at least 8 charcaters.',
      });
      return;
    }

    if (!email || typeof email !== 'string') {
      res.status(400).json('Please enter a valid email.');
      return;
    }

    //// Using saltrounds for calculation time of hash
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      username,
      password: hashedPassword,
      email,
      role,
    });
    res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

/// Login the user

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (!foundUser) {
    res.status(404).json({ message: 'username does not exist' });
    return;
  }

  const isPasswordMatched = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordMatched) {
    res.status(401).json({ message: 'password does not match' });
    return;
  }
  const payload = { username };

  const authToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
    algorithm: 'HS256',
    expiresIn: '10m',
  });

  res.status(200).json({ isLoggedIn: true, authToken });
});

//// Verify if the bearer token is valid
router.get('/verify', async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');
  /// console.log({ token })

  try {
    // verify the jwt with the jsonwebtoken package
    const payload = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
    ////console.log({ payload })

    res.json({ token, payload });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid token' });
  }
});

module.exports = router;
