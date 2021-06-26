const { Router } = require("express")
const db = require('firebase-admin').firestore()

const contactRouter = Router()

contactRouter.post('/submit', async (req, res) => {
    const form = {
        email: req.body.email,
        message: req.body.message,
        name: req.body.name
    }
    try {
        await db.collection('messages').add(form)
        return res.json({ success: 'Message sent successfully' })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = contactRouter