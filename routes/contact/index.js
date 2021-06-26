const { Router } = require("express")
const contactRouter = require("./contactRouter")

const contact = Router()

contact.use(contactRouter)

module.exports = contact