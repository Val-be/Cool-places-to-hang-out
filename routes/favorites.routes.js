const Favorite = require('../models/Favorite.model');
const router = require('express').Router();
const isLoggedIn = require('../middleware/isLoggedin');
const isAdmin = require('../middleware/isAdmin');

//Fetch all favorites by user id
router.get('/:userId', async (req, res, next) => {
  try {
    const id = req.params.userId;
    const foundFavorites = await Favorite.find({ userId: id });
    res.status(200).json(foundFavorites);
  } catch (error) {
    res.sendStatus(404);
  }
});

//Fetch all favorites by place id
router.get('/:placeId', async (req, res, next) => {
  try {
    const id = req.params.placeId;
    const foundFavorites = await Favorite.find({ placeId: id });
    res.status(200).json(foundFavorites);
  } catch (error) {}
});

//Create favorite
router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const createdFavorite = await Favorite.create(req.body);
    req.status(201).json(createdFavorite);
  } catch (error) {
    res.sendStatus(400);
  }
});

//Delete favorite
router.delete('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.id;
    const foundComment = await Comment.findById(id);
    if (req.user._id.toString() === foundComment.user.toString() || isAdmin()) {
      const deletedFavorite = await Favorite.findByIdAndDelete(id);
      res.status(200).json(deletedFavorite);
    }
  } catch (error) {
    res.sendStatus(404);
  }
});

module.exports = router;
