const isAdmin = require('../middleware/isAdmin');
const isLoggedIn = require('../middleware/isLoggedin');
const Place = require('../models/Place.model');
const router = require('express').Router();

//Fetch all places
router.get('/', async (req, res, next) => {
  try {
    const foundPlaces = await Place.find();
    res.status(200).json(foundPlaces);
  } catch (error) {
    res.sendStatus(404);
  }
});

//Fetch place by id
router.get('/:id', async (req, res, next) => {
  try {
    const foundPlace = await Place.findById(req.params.id);
    res.status(200).json(foundPlace);
  } catch (error) {
    res.sendStatus(404);
  }
});

//Create place
router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const createdPlace = await Place.create(req.body);
    res.status(201).json(createdPlace);
  } catch (error) {
    res.sendStatus(400);
  }
});

//Update place
router.patch('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.id;
    const foundPlace = await Place.findById(id);
    if (foundPlace.user.toString() === req.user._id.toString() || isAdmin) {
      const updatedPlace = await Place.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(updatedPlace);
    }
  } catch (error) {
    res.sendStatus(400);
  }
});

//Delete place
router.delete('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const id = req.params.id;
    const foundPlace = await Place.findById(id);
    if (foundPlace.user.toString() === req.user._id.toString() || isAdmin) {
      const deletedPlace = await Place.findByIdAndDelete(id);
      res.status(200).json(deletedPlace);
    }
  } catch (error) {
    res.sendStatus(404);
  }
});

module.exports = router;
