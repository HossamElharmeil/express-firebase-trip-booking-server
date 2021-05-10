const Router = require('express').Router

const auth = require('./auth')
const profile = require('./profile')

const routes = Router()

routes.use('/auth', auth)
routes.use('/profile', profile)

module.exports = routes
