const { validationResult } = require('express-validator')
const LoggingUtil = require('../utils/logging-utils')

const HttpError = require('../models/http-error')
const User = require('../models/user')

const getAllUsers = async (req, res, next) => {
  console.log('[USERS: /] GET /')
  // Declarations
  let users = []
  try {
    users = await User.find({}, '-password')
  } catch (error) {
    LoggingUtil.getDatabaseInteractMsg('getAllUsers', error)
    return next(new HttpError('Retrieving users unsuccessful. Please try again later', 500))
  }
  res.json({ users: users.map(user => user.toObject()) })
}

const performSignUp = async (req, res, next) => {
  console.log('[USERS: /] POST /signup')
  // Validations
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    LoggingUtil.getUserReqMessage('performSignUp', errors)
    return res.status(422).json(errors)
  }
  const { name, email, password } = req.body
  let existingUser
  try {
    existingUser = await User.findOne({ email: email })
  } catch (error) {
    LoggingUtil.getDatabaseInteractMsg('performSignUp', error)
    return next(new HttpError('Signing up unsuccessful. Please try again later', 500))
  }
  if (existingUser) {
    return next(new HttpError('Email already exists.'), 404)
  }
  // Declarations
  const newUser = new User({
    name,
    email,
    image: 'https://img.icons8.com/bubbles/2x/user.png',
    password,
    places: []
  })
  let result = {}
  // Execute
  try {
    result = await newUser.save()
  } catch (error) {
    LoggingUtil.getDatabaseInteractMsg('performSignUp', error)
    return next(new HttpError('Signing up unsuccessful. Please try again later', 500))
  }
  res
    .status(201)
    .json({ user: result.toObject({ getters: true }) })
}

const performLogIn = async (req, res, next) => {
  console.log('[USERS: /] POST /login')
  // Validations
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    LoggingUtil.getUserReqMessage('performLogIn', errors)
    return res.status(422).json(errors)
  }
  const { email, password } = req.body
  // Temporary Authentication
  let identifiedUser
  try {
    identifiedUser = await User.findOne({ email: email })
  } catch (error) {
    LoggingUtil.getDatabaseInteractMsg('performLogIn', error)
    return next(new HttpError('Signing up failed. Please try again'))
  }
  if (!identifiedUser || identifiedUser.password !== password) {
    return next(new HttpError('Invalid email or password', 401))
  }
  // Execute
  return res
    .status(200)
    .json({ user: identifiedUser.toObject({ getters: true }) })
}

exports.getAllUsers = getAllUsers
exports.performSignUp = performSignUp
exports.performLogIn = performLogIn
