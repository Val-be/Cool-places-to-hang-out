const Comment = require('../models/Comment.model');
const router = require('express').Router();
const isLoggedIn = require('../middleware/isLoggedin');
const isAdminOrPoster = require('../middleware/isAdminOrPoster');

//Get all comments by user id
router.get('/findByUser/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const foundComments = await Comment.find({ user: userId });
    res.status(200).json(foundComments);
  } catch (error) {
    res.status(404).json({ message: 'No comments found for this user id.' });
  }
});

//Get all comments by place id
router.get('/findByPlace/:placeId', async (req, res, next) => {
  try {
    const placeId = req.params.placeId;
    const foundComments = await Comment.find({ place: placeId });
    res.status(200).json(foundComments);
  } catch (error) {
    res.status(404).json({ message: 'No comments found for this place id.' });
  }
});

//Create comment
router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { text, place } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ message: 'Please enter a text to comment.' });
      return;
    }

    if (!place || typeof place.toString() !== 'string') {
      res.status(400).json({ message: 'Please give a valid place.' });
    }
    const createdComment = await Comment.create({ ...req.body, user: userId });
    res.status(200).json(createdComment);
  } catch (error) {
    res.sendStatus(400);
  }
});

//Update comment
router.patch(
  '/:id',
  isLoggedIn,
  isAdminOrPoster(Comment),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const { text } = req.body;
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { text },
        {
          new: true,
        }
      );
      res.status(200).json(updatedComment);
    } catch (error) {
      res.sendStatus(404);
    }
  }
);

//Delete comment
router.delete(
  '/:id',
  isLoggedIn,
  isAdminOrPoster(Comment),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const deletedComment = await Comment.findByIdAndDelete(id);
      res.status(200).json(deletedComment);
    } catch (error) {
      res.sendStatus(404);
    }
  }
);

module.exports = router;
