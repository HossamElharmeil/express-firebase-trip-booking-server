const Router = require('express').Router
const verifyToken = require('../../middleware/verifyToken')
const db = require('firebase-admin').firestore()

const registerRouter = Router()

registerRouter.post('/registerCaptain', verifyToken, async (req, res) => {
    const newData = {
        uid: req.uid,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        verified: false
    }

    try {
        await db.collection('captains').doc(req.uid).set(newData)
        return res.json({ success: 'Captain data updated' })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

registerRouter.post('/registerUser', verifyToken, async (req, res) => {
    const newData = {
        uid: req.uid,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email
    }

    try {
        await db.collection('users').doc(req.uid).set(newData)
        return res.json({ success: 'User data updated' })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = registerRouter