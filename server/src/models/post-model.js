const { Schema, model } = require('mongoose')

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: Date,
    default: new Date(),
  },
  files: [
    {
      type: Schema.Types.ObjectId,
      ref: 'File',
    },
  ],
}, { timestamps: true });

module.exports = model('Post', postSchema);