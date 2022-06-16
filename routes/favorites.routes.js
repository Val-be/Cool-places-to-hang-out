const Favorite = require('../models/Favorite.model');
const router = require('express').Router();
const isLoggedIn = require('../middleware/isloggedin');
const isAdminOrPoster = require('../middleware/isAdminOrPoster');

//Fetch all favorites by user id
router.get('/:id/user', async (req, res, next) => {
  try {
    const id = req.params.id;
    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    if (limit > 50) {
      limit = 50;
    }
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const filter = {};

    const totalDocumentCount = await Favorite.countDocuments(filter);

    const next =
      endIndex < totalDocumentCount
        ? {
            page: page + 1,
            limit: limit,
          }
        : null;

    const previous =
      startIndex > 0
        ? {
            page: page - 1,
            limit: limit,
          }
        : null;
    const foundFavorites = await Favorite.find({ user: id })
      .limit(limit)
      .skip(startIndex)
      .populate('user place', { username: 1, name: 1 });
    res
      .status(200)
      .json({ foundFavorites, next, previous, totalDocumentCount });
  } catch (error) {
    next(error);
  }
});

//Fetch all favorites by place id
router.get('/:id/place', async (req, res, next) => {
  try {
    const id = req.params.id;
    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    if (limit > 50) {
      limit = 50;
    }
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const filter = {};

    const totalDocumentCount = await Favorite.countDocuments(filter);

    const next =
      endIndex < totalDocumentCount
        ? {
            page: page + 1,
            limit: limit,
          }
        : null;

    const previous =
      startIndex > 0
        ? {
            page: page - 1,
            limit: limit,
          }
        : null;

    const foundFavorites = await Favorite.find({ place: id })
      .limit(limit)
      .skip(startIndex)
      .populate('user place', { username: 1, name: 1 });
    res
      .status(200)
      .json({ foundFavorites, next, previous, totalDocumentCount });
  } catch (error) {
    next(error);
  }
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
    next(error);
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
      const deletedFavorite = await Favorite.findByIdAndDelete(id);
      res.status(200).json(deletedFavorite);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
