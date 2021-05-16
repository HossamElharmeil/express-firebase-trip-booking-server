const Router = require('express').Router
const profileRouter = Router()

const registerRouter = require('./registerRouter')
const imageRouter = require('./imageRouter')
const getRouter = require('./getRouter')

profileRouter.use('/register', registerRouter)
profileRouter.use('/images', imageRouter)
profileRouter.use('/get', getRouter)

module.exports = profileRouter