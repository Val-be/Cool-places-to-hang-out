const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const placeSchema = new Schema(
  {
    Name: {
      type: String,
      // unique: true -> Ideally, should be unique, but its up to you
    },
    location: String,
    Type: String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Place = model("User", placeSchema);

module.exports = Place;
