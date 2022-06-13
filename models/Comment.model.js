const { Schema, model, SchemaTypes } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const commentSchema = new Schema(
  {
    Text: {
      type: String,
      // unique: true -> Ideally, should be unique, but its up to you
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
    place: {
      type: SchemaTypes.ObjectId,
      ref: 'Place',
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Comment = model('Comment', commentSchema);

module.exports = Comment;
