const express = require('express')
const router = express.Router()

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

router.get('/:pid', (req, res, next) => {
  const placeId = req.params.pid
  console.log(`[PLACES: /:pid] GET /${placeId}`)
  const place = DUMMY_PLACES.find(p => p.id === placeId)
  if (!place) {
    const error = new Error('Could not find a place for the provided pid.')
    error.code = 404
    return next(error)
  }
  res.json({ place })
})

router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid
  console.log(`[PLACES: /user/:uid] GET /${userId}`)
  const place = DUMMY_PLACES.find(p => p.creator === userId)
  if (!place) {
    const error = new Error('Could not find a place for the provided uid.')
    error.code = 404
    throw error
  }
  res.json({ place })
})

module.exports = router
