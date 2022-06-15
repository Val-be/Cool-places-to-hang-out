const { Schema, model, SchemaTypes } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const placeSchema = new Schema(
  {
    name: {
      type: { type: String, required: true,unique: true },
    },
    address: String,
    geolocation: { type: Array,required: true},
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

const Place = model('Place', placeSchema);

module.exports = Place;
