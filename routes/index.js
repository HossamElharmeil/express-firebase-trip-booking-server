const Router = require('express').Router

const routes = Router()

const admin = require('./admin')
const auth = require('./auth')
const captain = require('./captain')
const contact = require('./contact')
const invitations = require('./invitations')
const notifications = require('./notifications')
const profile = require('./profile')
const tokens = require('./tokens')
const trips = require('./trips')
const wallet = require('./wallet')

routes.use('/admin', admin)
routes.use('/auth', auth)
routes.use('/captain', captain)
routes.use('/contact', contact)
routes.use('/invitations', invitations)
routes.use('/notifications', notifications)
routes.use('/profile', profile)
routes.use('/tokens', tokens)
routes.use('/trips', trips)
routes.use('/wallet', wallet)

module.exports = routes
