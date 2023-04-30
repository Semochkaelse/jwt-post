const { Schema, model } = require('mongoose')

const FileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  extension: {
    type: String,
    required: true
  },
  mime_type: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  upload_date: {
    type: Date,
    required: true
  }
});

module.exports = model('File', FileSchema)