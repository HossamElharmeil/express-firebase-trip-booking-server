const express = require('express')
const authRouter = require('./authRouter')

const router = express()

router.use(authRouter)

module.exports = router
