const isLoggedIn = require('../middleware/isLoggedIn');
const isAdminOrPoster = require('../middleware/isAdminOrPoster');
const isAdmin = require('../middleware/isAdmin');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');
const router = require('express').Router();

//Fetch all users
router.get('/', async (req, res, next) => {
  try {
    const foundUsers = await User.find();
    res.status(200).json(foundUsers);
  } catch (error) {
    res.sendStatus(404);
  }
});

//Fetch user by id
router.get('/:id', async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.params.id);
    res.status(200).json(foundUser);
  } catch (error) {
    res.sendStatus(404);
  }
});

//Update user
router.patch(
  '/:id',
  isLoggedIn,
  isAdminOrPoster(User),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const { username, email } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { username, email },
        {
          new: true,
        }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(404).json({ message: 'Not found' });
    }
  }
);

//Change role of user
router.patch('/role/:id', isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;
    const { role } = req.body;
    const foundUser = await User.findById(id);
    if (foundUser.role !== 'admin') {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { role },
        {
          new: true,
        }
      );
      res.status(200).json(updatedUser);
    } else {
      res
        .status(401)
        .json({ message: "You can't change the role of an admin." });
    }
  } catch (error) {
    res.status(404).json({ message: 'Not found' });
  }
});

//Change user password
router.patch(
  '/password/:id',
  isLoggedIn,
  isAdminOrPoster(User),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const { currentPassword, newPassword } = req.body;
      const foundUser = await User.findById(id);

      const isPasswordMatched = await bcrypt.compare(
        currentPassword,
        foundUser.password
      );

      if (isPasswordMatched) {
        const salt = await bcrypt.genSalt(saltRounds);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);
        const updatedUser = await User.findByIdAndUpdate(id, {
          password: newHashedPassword,
        });
        res.status(200).json(updatedUser);
      } else {
        res.status(400).json({ message: 'Password does not match.' });
        return;
      }
    } catch (error) {
      console.error(error);
      res.status(404).json({ message: 'Not found.' });
    }
  }
);

//Delete user
router.delete(
  '/:id',
  isLoggedIn,
  isAdminOrPoster(User),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const deletedUser = await User.findByIdAndDelete(id);
      res.status(200).json(deletedUser);
    } catch (error) {
      res.sendStatus(404);
    }
  }
);

module.exports = router;
