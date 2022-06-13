const User = require("../models/User.model");
const router = require("express").Router();

//Fetch all users
router.get("/", async (req, res, next) => {
  try {
    const foundUsers = await User.find();
    res.status(200).json(foundUsers);
  } catch (error) {
    res.sendStatus(404);
  }
});

//Fetch user by id
router.get("/:id", async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.params.id);
    res.status(200).json(foundUser);
  } catch (error) {
    res.sendStatus(404);
  }
});

//Update user
router.post("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.sendStatus(400);
  }
});

//Delete user
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id);
    res.status(200).json(deletedUser);
  } catch (error) {
    res.sendStatus(404);
  }
});

module.exports = router;