const messaging = require('firebase-admin').messaging()

const messagingService = {
    sendMessage: (token, message) => {
        messaging.sendToDevice(token, message)
    }
}

module.exports = messagingService