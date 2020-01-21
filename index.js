const express = require('express')
const bodyParser = require('body-parser')

const HttpError = require('./models/http-error')
const placesRoutes = require('./routes/places-routes')

const app = express()
app.use(bodyParser.json())

// Route Handlers
app.use('/api/places', placesRoutes)

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

app.listen(5000)
