const { Schema, model, SchemaTypes } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const favoriteSchema = new Schema(
  {
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    place: {
      type: SchemaTypes.ObjectId,
      ref: 'Place',
      required: true,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Favorite = model('Favorite', favoriteSchema);

module.exports = Favorite;
