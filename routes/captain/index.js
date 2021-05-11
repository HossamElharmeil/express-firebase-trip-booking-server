const Router = require('express').Router
const captainRouter = Router()

const carsRouter = require('./carsRouter')
captainRouter.use('/cars', carsRouter)

module.exports = captainRouter
