const { Schema, model, Types } = require('mongoose')

const placeSchema = Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    minLength: 5
  },
  image: {
    type: String,
    required: true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  address: {
    type: String,
    required: true
  },
  creator: {
    type: Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

module.exports = model('Place', placeSchema)
