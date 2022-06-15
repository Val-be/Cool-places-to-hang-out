const Comment = require('../models/Comment.model');
const router = require('express').Router();
const isLoggedIn = require('../middleware/isLoggedin');
const isAdminOrPoster = require('../middleware/isAdminOrPoster');

//Get all comments by user id
router.get('/:id/user', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    if (limit > 50) {
      limit = 50;
    }
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const filter = {};

    const totalDocumentCount = await Comment.countDocuments(filter);

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
    const foundComments = await Comment.find({ user: userId })
      .limit(limit)
      .skip(startIndex)
      .populate('user');
    res.status(200).json({ foundComments, next, previous, totalDocumentCount });
  } catch (error) {
    next(error);
  }
});

//Get all comments by place id
router.get('/:id/Place', async (req, res, next) => {
  try {
    const placeId = req.params.placeId;
    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    if (limit > 50) {
      limit = 50;
    }
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const filter = {};

    const totalDocumentCount = await Comment.countDocuments(filter);

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

    const foundComments = await Comment.find({ place: placeId })
      .limit(limit)
      .skip(startIndex)
      .populate('user');
    res.status(200).json({ foundComments, next, previous, totalDocumentCount });
  } catch (error) {
    next(error);
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
    next(error);
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
      next(error);
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
      next(error);
    }
  }
);

module.exports = router;
