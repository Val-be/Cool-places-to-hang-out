const Comment = require("../models/Comment.model");
const router = require("express").Router();

//Get all comments by user id
router.get("/:userId", async (req, res, next) => {
  try {
    const id = req.params.userId;
    const foundComments = await Comment.findById(id);
    res.status(200).json(foundComments);
  } catch (error) {
    res.status(404);
  }
});

//Get all comments by place id
router.get("/:placeId", async (req, res, next) => {
  try {
    const id = req.params.placeId;
    const foundComments = await Comment.findById(id);
    res.status(200).json(foundComments);
  } catch (error) {
    res.status(404);
  }
});

//Create comment
router.post("/", async (req, res, next) => {
  try {
    const createdComment = await Comment.create(req.body);
    res.status(200).json(createdComment);
  } catch (error) {
    res.sendStatus(400);
  }
});

//Update comment
router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedComment = await Comment.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedComment);
  } catch (error) {
    res.sendStatus(404);
  }
});

//Delete comment
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedComment = await Comment.findByIdAndDelete(id);
    res.status(200).json(deletedComment);
  } catch (error) {
    res.sendStatus(404);
  }
});

module.exports = router;
