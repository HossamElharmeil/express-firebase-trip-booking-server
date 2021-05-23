const { Router } = require("express")
const db = require('firebase-admin').firestore()
const verifyToken = require('../../middleware/verifyToken')

const notificationsRouter = Router()

notificationsRouter.get('/getNotifications', verifyToken, async (req, res) => {
    try {
        const notificationsQuery = await db.collection('notifications').doc(req.user.uid).collection('notifications').get()
        const notifications = notificationsQuery.docs.map(notification => notification.data())
        
        return res.json({ notifications })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = notificationsRouter