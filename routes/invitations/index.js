const { Router } = require('express')
const invitations = Router()

const invitationsRouter = require('./invitationsRouter')

invitations.use(invitationsRouter)

module.exports = invitations