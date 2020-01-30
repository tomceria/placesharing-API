const { validationResult } = require('express-validator')
const { getCoordsForAddress } = require('../utils/location-utils')
const LoggingUtil = require('../utils/logging-utils')

const HttpError = require('../models/http-error')
const Place = require('../models/place')

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  }
]

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid
  console.log(`placeId: ${placeId}`)
  console.log(`[PLACES: /:pid] GET /${placeId}`)
  // Validations
  let place
  try {
    place = await Place.findById(placeId).exec()
  } catch (error) {
    LoggingUtil.getDatabaseInteractMsg('getPlaceById', error)
  }
  if (!place) {
    return next(new HttpError('Could not find a place for the provided pid.', 404))
  }
  res.json({ place })
}

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid
  console.log(`[PLACES: /user/:uid] GET /${userId}`)
  const places = DUMMY_PLACES.filter(p => p.creator === userId)
  if (!places || places.length <= 0) {
    throw new HttpError('Could not find a place for the provided uid.', 404)
  }
  res.json({ places })
}

const createPlace = async (req, res, next) => {
  console.log('[PLACES: /] POST /')
  // Validations
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    LoggingUtil.getUserReqMessage('createPlace', errors)
    return res.status(422).json(errors)
  }
  // Declarations
  const { title, description, address, creator } = req.body
  const newPlace = new Place({
    title,
    description,
    address,
    location: getCoordsForAddress(),
    image: 'https://external-preview.redd.it/rAu9SdsqxWCmiA3NKT75q_zAz2lvXYPoXp6MTORGe9c.jpg',
    creator
  })
  let result = {}
  // Execute
  try {
    result = await newPlace.save()
  } catch (error) {
    LoggingUtil.getDatabaseInteractMsg('createPlace', error)
    return next(new HttpError('Creating new Place unsuccessful', 500))
  }
  res
    .status(201)
    .json({ place: result })
}

const updatePlace = (req, res, next) => {
  const placeId = req.params.pid
  console.log(`[PLACES: /:pid] PATCH /${placeId}`)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    return next(new HttpError('Invalid inputs.', 422))
  }
  if (DUMMY_PLACES.filter(place => place.id === placeId).length <= 0) {
    return next(new HttpError('Could not find a place for the provided pid.'), 404)
  }
  const { title, description } = req.body
  const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) }
  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId)
  updatedPlace.title = title
  updatedPlace.description = description
  DUMMY_PLACES[placeIndex] = updatedPlace
  res
    .status(200)
    .json({ place: updatedPlace })
}

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid
  console.log(`[PLACES: /:pid] DELETE /${placeId}`)
  if (!DUMMY_PLACES.find(place => place.id === placeId)) {
    return next(new HttpError('Could not find a place for the provided pid.'), 404)
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(place => place.id !== placeId)
  res
    .status(200)
    .send()
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace
