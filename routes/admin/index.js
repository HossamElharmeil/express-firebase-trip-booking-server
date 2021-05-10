const Router = require('express').Router
const verifyAdmin = require('../../middleware/verifyAdmin')

const adminRouter = Router()
adminRouter.use(verifyAdmin)

const usersRouter = require('./usersRouter')
const captainsRouter = require('./captainsRouter')
adminRouter.use('/users', usersRouter)
adminRouter.use('/captains', captainsRouter)

module.exports = adminRouter