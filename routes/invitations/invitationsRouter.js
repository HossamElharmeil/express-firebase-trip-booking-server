const { Router } = require('express')
const invitationsRouter = Router()

invitationsRouter.post('/invite', (req, res) => {
    return res.json({ error: 'Coming soon' })
})

module.exports = invitationsRouter