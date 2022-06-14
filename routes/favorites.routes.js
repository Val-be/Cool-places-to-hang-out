const Favorite = require('../models/Favorite.model');
const router = require('express').Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const isAdminOrPoster = require('../middleware/isAdminOrPoster');

//Fetch all favorites by user id
router.get('/findByUser/:userId', async (req, res, next) => {
  try {
    const id = req.params.userId;
    const foundFavorites = await Favorite.find({ user: id });
    res.status(200).json(foundFavorites);
  } catch (error) {
    res.sendStatus(404);
  }
});

//Fetch all favorites by place id
router.get('/findByPlace/:placeId', async (req, res, next) => {
  try {
    const id = req.params.placeId;
    const foundFavorites = await Favorite.find({ place: id });
    res.status(200).json(foundFavorites);
  } catch (error) {}
});

//Create favorite
router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const createdFavorite = await Favorite.create({
      ...req.body,
      user: userId,
    });
    res.status(201).json(createdFavorite);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});

//Delete favorite
router.delete(
  '/:id',
  isLoggedIn,
  isAdminOrPoster(Favorite),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      // const foundComment = await Comment.findById(id);
      // if (
      //   req.user._id.toString() === foundComment.user.toString() ||
      //   isAdmin()
      // ) {
      // }
      const deletedFavorite = await Favorite.findByIdAndDelete(id);
      res.status(200).json(deletedFavorite);
    } catch (error) {
      res.sendStatus(404);
    }
  }
);

module.exports = router;
