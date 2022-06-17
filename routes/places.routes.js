const { request } = require('express');
const isAdminOrPoster = require('../middleware/isAdminOrPoster');
const isLoggedIn = require('../middleware/isLoggedin');
const Place = require('../models/Place.model');
const router = require('express').Router();
const { default: axios } = require('axios');

//Fetch all places
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    if (limit > 50) {
      limit = 50;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const name = req.query.name;
    const typology = req.query.type;

    const filter = {};
    if (name) {
      filter.name = name;
    }

    if (typology) {
      filter.typology = typology;
    }

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

    const results = await Place.find(filter, {
      geometry: 0,
    })
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
    const name = req.query.name;
    const typology = req.query.type;

    const filter = {
      geometry: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates },
          $maxDistance: maxDistance,
        },
      },
    };
    if (name) {
      filter.name = name;
    }

    if (typology) {
      filter.typology = typology;
    }
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
    const nearPlaces = await Place.find(filter);
    res.status(200).json(nearPlaces);
  } catch (error) {
    next(error);
  }
});

//Create place
router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { address } = req.body;
    let longitude = 0;
    let latitude = 0;
    if (address) {
      const geocode = await axios.get(
        `https://geocode.maps.co/search?q={${address}}`
      );
      console.log(geocode);
      longitude = parseFloat(geocode.data[0].lon);
      latitude = parseFloat(geocode.data[0].lat);
    }
    const geometry = { type: 'Point', coordinates: [longitude, latitude] };
    const createdPlace = await Place.create({
      ...req.body,
      user: userId,
      geometry,
    });
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
