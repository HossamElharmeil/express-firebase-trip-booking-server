const Router = require('express').Router

const routes = Router()

const auth = require('./auth')
const profile = require('./profile')
const admin = require('./admin')
const captain = require('./captain')

routes.use('/auth', auth)
routes.use('/profile', profile)
routes.use('/admin', admin)
routes.use('/captain', captain)

module.exports = routes
