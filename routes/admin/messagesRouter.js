const Router = require('express').Router
const db = require('firebase-admin').firestore()

const messagesRouter = Router()

messagesRouter.get('/getMessages', async (_, res) => {
    const messagesQuery = await db.collection('messages').get()
    const messages = messagesQuery.docs.map(doc => {
        const data = doc.data()
        data.id = doc.id
        return data
    })

    res.json(messages)
})

messagesRouter.post('/getMessage', async (req, res) => {
    const id = req.body.id

    const messageQuery = await db.collection('messages').doc(id).get()

    const message = messageQuery.data()
    message.id = messageQuery.id

    return res.json(message)
})

module.exports = messagesRouter
