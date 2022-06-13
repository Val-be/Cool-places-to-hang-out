const router = require('express').Router();
const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const placesRoutes = require('./places.routes');
const favoritesRoutes = require('./favorites.routes');
const commentsRoutes = require('./comments.routes');

router.get('/', (req, res, next) => {
  res.json('All good in here');
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/places', placesRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/comments', commentsRoutes);

module.exports = router;
