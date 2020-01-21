const uuid = require('uuid/v4')

const HttpError = require('../models/http-error')

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid
  console.log(`[PLACES: /:pid] GET /${placeId}`)
  const place = DUMMY_PLACES.find(p => p.id === placeId)
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
  DUMMY_PLACES.push(newPlace)
  res
    .status(201)
    .json({ place: newPlace })
}

const updatePlace = (req, res, next) => {
  const placeId = req.params.pid
  console.log(`[PLACES: /:pid] PATCH /${placeId}`)
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
  if (DUMMY_PLACES.filter(place => place.id === placeId).length <= 0) {
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
