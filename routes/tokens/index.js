const Router = require("express").Router
const tokens = Router()

const captainRouter = require('./captainRouter')
const userRouter = require('./userRouter')

tokens.use('/captain', captainRouter)
tokens.use('/user', userRouter)

module.exports = tokens