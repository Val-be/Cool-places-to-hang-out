const isAdminOrPoster = require('../middleware/isAdminOrPoster');
const isLoggedIn = require('../middleware/isLoggedIn');
const Place = require('../models/Place.model');
const router = require('express').Router();

//Fetch all places
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
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
router.get('/fetchId/:id', async (req, res, next) => {
  try {
    const foundPlace = await Place.findById(req.params.id).populate('user');
    res.status(200).json(foundPlace);
  } catch (error) {
    next(error);
  }
});

//Fetch near places
router.get('/near', async (req, res, next) => {
  try {
    const longitude = parseFloat(req.query.longitude);
    const latitude = parseFloat(req.query.latitude);
    const coordinates = [longitude, latitude];
    const maxDistance = parseInt(req.query.maxDistance);
    console.log(coordinates, maxDistance);
    let errorMessage = '';
    if (
      !longitude ||
      typeof longitude !== 'number' ||
      !latitude ||
      typeof latitude !== 'number'
    ) {
      errorMessage +=
        'Please enter valid coordinates, i.e a longitude followed and a latitude. ';
    }
    if (!maxDistance || typeof maxDistance !== 'number') {
      errorMessage += 'Please enter a valid distance in meters.';
    }
    if (errorMessage.length !== 0) {
      res.status(400).json({ message: errorMessage.trim() });
    }
    const nearPlaces = await Place.find({
      geometry: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates },
          $maxDistance: maxDistance,
        },
      },
    });
    res.status(200).json(nearPlaces);
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
