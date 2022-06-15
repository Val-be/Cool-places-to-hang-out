const isAdminOrPoster = require('../middleware/isAdminOrPoster');
const isLoggedIn = require('../middleware/isLoggedIn');
const Place = require('../models/Place.model');
//const { paginatedQuery } = require('./helpers/pagination');
const router = require('express').Router();

//Fetch all places
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page);
    //const limit = parseInt(req.query.limit);
    let limit = req.query.limit;
    if (limit > 50) {
      limit = 50;
    } else {
      return;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const filter = {};

    const totalDocumentCount = await Place.countDocuments(filter);

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

    const results = await Place.find(filter)
      .limit(limit)
      .skip(startIndex)
      .populate('user');

    res.status(200).json({
      results,
      next,
      previous,
      totalDocumentCount,
    });
  } catch (error) {
    next(error);
  }
});

//Fetch place by id
router.get('/:id', async (req, res, next) => {
  try {
    const foundPlace = await Place.findById(req.params.id).populate('user');
    res.status(200).json(foundPlace);
  } catch (error) {
    next(error);
  }
});

//Create place
router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const createdPlace = await Place.create({ ...req.body, user: userId });
    res.status(201).json(createdPlace);
  } catch (error) {
    next(error);
  }
});

//Update place
router.patch(
  '/:id',
  isLoggedIn,
  isAdminOrPoster(Place),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const updatedPlace = await Place.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(updatedPlace);
    } catch (error) {
      next(error);
    }
  }
);

//Delete place
router.delete(
  '/:id',
  isLoggedIn,
  isAdminOrPoster(Place),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const deletedPlace = await Place.findByIdAndDelete(id);
      res.status(200).json(deletedPlace);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
