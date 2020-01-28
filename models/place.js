const { Schema, model } = require('mongoose')

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
    type: String,
    required: true
  }
})

module.exports = model('Place', placeSchema)
