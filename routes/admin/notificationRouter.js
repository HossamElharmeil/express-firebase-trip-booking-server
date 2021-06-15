const Router = require('express').Router
const messaging = require('../../services/messaging')


const notificationRouter = Router()

notificationRouter.post('/sendNotification', async (req, res) => {
    const title = req.body.title
    const body = req.body.body
    const target = req.body.target

    if (target === 'Clients') {
        await messaging.sendToMany('users', {
            notification: {
                title,
                body
            },
            data: {
                click_action: "FLUTTER_NOTIFICATION_CLICK",
                type: 'general_notification'
            }
        })

        return res.json({ success: 'Notification sent successfully' })
    }
    else if (target === 'Drivers') {
        await messaging.sendToMany('captains', {
            notification: {
                title,
                body
            },
            data: {
                click_action: "FLUTTER_NOTIFICATION_CLICK",
                type: 'general_notification'
            }
        })

        return res.json({ success: 'Notification sent successfully' })
    }
    else {
        await messaging.sendToMany('captains', {
            notification: {
                title,
                body
            },
            data: {
                click_action: "FLUTTER_NOTIFICATION_CLICK",
                type: 'general_notification'
            }
        })
        
        await messaging.sendToMany('users', {
            notification: {
                title,
                body
            },
            data: {
                click_action: "FLUTTER_NOTIFICATION_CLICK",
                type: 'general_notification'
            }
        })

        return res.json({ success: 'Notification sent successfully' })
    }
})

module.exports = notificationRouter
