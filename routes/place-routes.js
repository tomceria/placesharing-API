const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

const placeController = require('../controllers/place-controllers')

router.get('/:pid', placeController.getPlaceById)
router.get('/user/:uid', placeController.getPlacesByUserId)

router.post('/',
  [
    check('title').not().isEmpty().withMessage('is required'),
    check('description').isLength({ min: 5 }).withMessage('must be at least 5 characters long'),
    check('address').not().isEmpty().withMessage('is required'),
    check('creator').not().isEmpty().withMessage('is required')
  ],
  placeController.createPlace)

router.patch('/:pid',
  [
    check('title').not().isEmpty().withMessage('is required'),
    check('description').isLength({ min: 5 }).withMessage('must be at least 5 characters long')
  ],
  placeController.updatePlace)

router.delete('/:pid', placeController.deletePlace)

module.exports = router
