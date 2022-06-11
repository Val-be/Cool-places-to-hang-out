const Favorite = require("../models/Favorite.model");
const router = require("express").Router();

//Fetch all favorites by user id
router.get("/favorites/:userId", async (req, res, next) => {
  try {
    const id = req.params.userId;
    const foundFavorites = await Favorite.find({ userId: id });
    res.status(200).json(foundFavorites);
  } catch (error) {
    res.sendStatus(404);
  }
});

//Fetch all favorites by place id
router.get("favorites/:placeId", async (req, res, next) => {
  try {
    const id = req.params.placeId;
    const foundFavorites = await Favorite.find({ placeId: id });
    res.status(200).json(foundFavorites);
  } catch (error) {}
});

//Create favorite
router.post("/favorites", async (req, res, next) => {
  try {
    const createdFavorite = await Favorite.create(req.body);
    req.status(201).json(createdFavorite);
  } catch (error) {
    res.sendStatus(400);
  }
});

//Delete favorite
router.delete("/favorites/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedFavorite = await Favorite.findByIdAndDelete(id);
    res.status(200).json(deletedFavorite);
  } catch (error) {
    res.sendStatus(404);
  }
});
