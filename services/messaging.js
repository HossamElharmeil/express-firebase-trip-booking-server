const messaging = require('firebase-admin').messaging()

const messagingService = {
    sendMessage: (token, message) => {
        return messaging.sendToDevice(token, message)
    },
    sendToMany: (topic, message) => {
        return messaging.sendToTopic(topic, message)
    },
    subscribe: (token, topic) => {
        return messaging.subscribeToTopic(token, topic)
    }
}

module.exports = messagingService