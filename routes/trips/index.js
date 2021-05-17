const Router = rquire('express').Router
const trips = Router()

const captainRouter = require('./captainRouter')
const userRouter = require('./userRouter')

trips.use('/captain', captainRouter)
trips.use('/user', userRouter)

module.exports = trips