const Router = require('express').Router
const verifyAdmin = require('../../middleware/verifyAdmin')

const adminRouter = Router()
adminRouter.use(verifyAdmin)

const captainsRouter = require('./captainsRouter')
const charityRouter = require('./charityRouter')
const financeRouter = require('./financeRouter')
const messagesRouter = require('./messagesRouter')
const notificationRouter = require('./notificationRouter')
const tripsRouter = require('./tripsRouter')
const usersRouter = require('./usersRouter')
const variablesRouter = require('./variablesRouter')

adminRouter.use('/captains', captainsRouter)
adminRouter.use('/charity', charityRouter)
adminRouter.use('/finance', financeRouter)
adminRouter.use('/messages', messagesRouter)
adminRouter.use('/notification', notificationRouter)
adminRouter.use('/trips', tripsRouter)
adminRouter.use('/users', usersRouter)
adminRouter.use('/variables', variablesRouter)

module.exports = adminRouter
