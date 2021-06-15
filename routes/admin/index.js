const Router = require('express').Router
const verifyAdmin = require('../../middleware/verifyAdmin')

const adminRouter = Router()
adminRouter.use(verifyAdmin)

const captainsRouter = require('./captainsRouter')
const financeRouter = require('./financeRouter')
const messagesRouter = require('./messagesRouter')
const tripsRouter = require('./tripsRouter')
const usersRouter = require('./usersRouter')
const variablesRouter = require('./variablesRouter')

adminRouter.use('/captains', captainsRouter)
adminRouter.use('/finance', financeRouter)
adminRouter.use('/messages', messagesRouter)
adminRouter.use('/trips', tripsRouter)
adminRouter.use('/users', usersRouter)
adminRouter.use('/variables', variablesRouter)

module.exports = adminRouter
