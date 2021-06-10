const Router = require('express').Router
const verifyAdmin = require('../../middleware/verifyAdmin')

const adminRouter = Router()
adminRouter.use(verifyAdmin)

const captainsRouter = require('./captainsRouter')
const messagesRouter = require('./messagesRouter')
const tripsRouter = require('./tripsRouter')
const usersRouter = require('./usersRouter')

adminRouter.use('/captains', captainsRouter)
adminRouter.use('/messages', messagesRouter)
adminRouter.use('/trips', tripsRouter)
adminRouter.use('/users', usersRouter)

module.exports = adminRouter
