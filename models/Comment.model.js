const { Schema, model, SchemaTypes } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
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

const Comment = model('Comment', commentSchema);

module.exports = Comment;
