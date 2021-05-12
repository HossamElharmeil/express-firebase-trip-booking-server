const Router = require('express').Router
const profileRouter = Router()

const registerRouter = require('./registerRouter')
const imageRouter = require('./imageRouter')

profileRouter.use('/register', registerRouter)
profileRouter.use('/images', imageRouter)

module.exports = profileRouter
