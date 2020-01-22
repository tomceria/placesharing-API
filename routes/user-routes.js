const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')

router.get('/', userController.getAllUsers)

router.post('/signup', userController.performSignUp)
router.post('/login', userController.performLogIn)

module.exports = router
