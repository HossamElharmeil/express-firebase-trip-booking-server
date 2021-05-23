const { Router } = require("express")
const notificationsRouter = require("./notificationsRouter")

const notifications = Router()

notifications.use(notificationsRouter)

module.exports = notifications