const uuid = require('uuid/v4')
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')

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

const performSignUp = (req, res, next) => {
  console.log('[USERS: /] POST /signup')
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors)
    return next(new HttpError('Invalid inputs.', 422))
  }
  const { name, email, password } = req.body
  if (DUMMY_USERS.find(user => user.email === email)) {
    return next(new HttpError('Email already exists', 422))
  }
  const newUser = { id: uuid(), name, email, password }
  DUMMY_USERS.push(newUser)
  res
    .status(201)
    .json({ user: newUser })
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
