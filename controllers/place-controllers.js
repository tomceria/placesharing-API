const uuid = require('uuid/v4')

const HttpError = require('../models/http-error')

const DUMMY_PLACES = [
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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid
  console.log(`[PLACES: /:pid] GET /${placeId}`)
  const place = DUMMY_PLACES.find(p => p.id === placeId)
  if (!place) {
    return next(new HttpError('Could not find a place for the provided pid.', 404))
  }
  res.json({ place })
}

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid
  console.log(`[PLACES: /user/:uid] GET /${userId}`)
  const place = DUMMY_PLACES.find(p => p.creator === userId)
  if (!place) {
    throw new HttpError('Could not find a place for the provided uid.', 404)
  }
  res.json({ place })
}

const createPlace = (req, res, next) => {
  console.log('[PLACES: /] POST /')
  const { title, description, location, address, creator } = req.body
  const newPlace = {
    id: uuid(),
    title,
    description,
    location,
    address,
    creator
  }
  console.log(newPlace)
  DUMMY_PLACES.push(newPlace)
  res
    .status(201)
    .json({ place: newPlace })
}

exports.getPlaceById = getPlaceById
exports.getPlaceByUserId = getPlaceByUserId
exports.createPlace = createPlace
