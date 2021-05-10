const Router = require('express').Router

const routes = Router()

const auth = require('./auth')
const profile = require('./profile')
const admin = require('./admin')

routes.use('/auth', auth)
routes.use('/profile', profile)
routes.use('/admin', admin)

module.exports = routes
