const Router = require('express').Router
const verifyToken = require('../../middleware/verifyToken')

const registerRouter = Router()

registerRouter.post('/registerCaptain', verifyToken, (req, res) => {
    res.send('mmyallo captain!')
})

module.exports = registerRouter