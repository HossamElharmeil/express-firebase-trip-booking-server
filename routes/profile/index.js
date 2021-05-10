const Router = require('express').Router
const profileRouter = Router()

const registerRouter = require('./registerRouter')
profileRouter.use('/register', registerRouter)

module.exports = profileRouter
