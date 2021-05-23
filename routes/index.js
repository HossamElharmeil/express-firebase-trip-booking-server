const Router = require('express').Router

const routes = Router()

const admin = require('./admin')
const auth = require('./auth')
const captain = require('./captain')
const notifications = require('./notifications')
const profile = require('./profile')
const tokens = require('./tokens')
const trips = require('./trips')

routes.use('/admin', admin)
routes.use('/auth', auth)
routes.use('/captain', captain)
routes.use('/notifications', notifications)
routes.use('/profile', profile)
routes.use('/tokens', tokens)
routes.use('/trips', trips)

module.exports = routes
