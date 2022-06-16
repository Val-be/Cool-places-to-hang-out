const { Schema, model, SchemaTypes } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const placeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: String,
    geometry: {
      type: Object,
      default: { type: 'Point', coordinates: [0, 0] },
    },
    typology: String,
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

placeSchema.index({ geometry: '2dsphere' });

const Place = model('Place', placeSchema);

module.exports = Place;
