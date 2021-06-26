const { Router } = require("express")
const db = require('firebase-admin').firestore()
const messaging = require('../../services/messaging')
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

notificationsRouter.post('/sendNotification', verifyToken, async (req, res) => {
    const uid = req.body.uid
    const collection = req.body.collection
    const message = req.body.message

    try {
        const targetData = (await db.collection(collection).doc(uid).get()).data()
        const registrationToken = targetData.registrationToken

        await messaging.sendMessage(registrationToken, {
            notification: {
                title: 'New message',
                body: message
            },
            data: {
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
                type: 'new_message',
                screen: 'chat'
            }
        })

        return res.json({ success: 'Message sent successfully' })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = notificationsRouter