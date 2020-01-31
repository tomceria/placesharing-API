const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const HttpError = require('./models/http-error')
const placeRoutes = require('./routes/place-routes')
const userRoutes = require('./routes/user-routes')

const dbURI = 'mongodb://hoangluuminh:Cara123!@localhost:27017/placesharing?authSource=admin'

const app = express()
app.use(bodyParser.json())

// Route Handlers
app.use('/api/places', placeRoutes)
app.use('/api/users', userRoutes)

// Undefined route Handler
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404)
  next(error)
})

// Error Handler
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || 'An unknown error occured' })
})

mongoose
  .connect(dbURI)
  .then(() => {
    app.listen(5000)
  })
  .catch((error) => {
    console.log(error)
  })
