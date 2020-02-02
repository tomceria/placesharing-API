const { validationResult } = require('express-validator')
const LoggingUtil = require('../utils/logging-utils')

const HttpError = require('../models/http-error')
const User = require('../models/user')

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Hoang',
    email: 'test@test.com',
    password: 'hoang124'
  }
]

const getAllUsers = (req, res, next) => {
  console.log('[USERS: /] GET /')
  res.json({ users: DUMMY_USERS })
}

const performSignUp = async (req, res, next) => {
  console.log('[USERS: /] POST /signup')
  // Validations
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    LoggingUtil.getUserReqMessage('performSignUp', errors)
    return res.status(422).json(errors)
  }
  const { name, email, password, places } = req.body
  let existingUser
  try {
    existingUser = await User.findOne({ email: email })
  } catch (error) {
    LoggingUtil.getDatabaseInteractMsg('performSignUp', error)
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
    places
  })
  let result = {}
  // Execute
  try {
    result = await newUser.save()
  } catch (error) {
    LoggingUtil.getDatabaseInteractMsg('performSignUp', error)
    return next(new HttpError('Signing Up unsuccessful', 500))
  }
  res
    .status(201)
    .json({ user: result.toObject({ getters: true }) })
}

const performLogIn = (req, res, next) => {
  console.log('[USERS: /] POST /login')
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    return next(new HttpError('Invalid inputs.', 422))
  }
  const { email, password } = req.body
  // Temporary Authentication
  const identifiedUser = DUMMY_USERS.find(user => user.email === email)
  if (!identifiedUser) {
    return next(new HttpError('Invalid email', 401))
  }
  if (identifiedUser.password !== password) {
    return next(new HttpError('Invalid password', 401))
  }
  return res
    .status(200)
    .json({ message: 'Logged in successfully!' })
}

exports.getAllUsers = getAllUsers
exports.performSignUp = performSignUp
exports.performLogIn = performLogIn
