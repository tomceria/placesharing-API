const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

const userController = require('../controllers/user-controller')

router.get('/', userController.getAllUsers)

router.post('/signup',
  [
    check('name').not().isEmpty().withMessage('is required'),
    check('email').normalizeEmail().isEmail().withMessage('has invalid format'),
    check('password').isLength({ min: 5 }).withMessage('must be at least 5 characters long')
  ],
  userController.performSignUp)
router.post('/login',
  [
    check('email').isEmail().withMessage('has invalid format'),
    check('password').isLength({ min: 5 }).withMessage('must be at least 5 characters long')
  ],
  userController.performLogIn)

module.exports = router
