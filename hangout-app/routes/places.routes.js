const Place = require("../models/Place.model");
const router = require("express").Router();

//Fetch all places
router.get("/", async (req, res, next) => {
  try {
    const foundPlaces = await Place.find();
    res.status(200).json(foundPlaces);
  } catch (error) {
    res.sendStatus(404);
  }
});

//Fetch place by id
router.get("/:id", async (req, res, next) => {
  try {
    const foundPlace = await Place.findById(req.params.id);
    res.status(200).json(foundPlace);
  } catch (error) {
    res.sendStatus(404);
  }
});

//Update place
router.post("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedPlace = await Place.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedPlace);
  } catch (error) {
    res.sendStatus(400);
  }
});

//Delete place
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedPlace = await Place.findByIdAndDelete(id);
    res.status(200).json(deletedPlace);
  } catch (error) {
    res.sendStatus(404);
  }
});

module.exports = router;
