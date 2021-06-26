const { Router } = require("express")
const charityRouter = require("./charityRouter")

const charity = Router()

charity.use(charityRouter)

module.exports = charity
