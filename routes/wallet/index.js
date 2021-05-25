const Router = require('express').Router
const wallet = Router()

const captainRouter = require('./captainRouter')
const userRouter = require('./userRouter')

wallet.use('captain', captainRouter)
wallet.use('/user', userRouter)

module.exports = wallet