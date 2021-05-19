const db = require('firebase-admin').firestore()
const Router = require("express").Router
const verifyToken = require('../../middleware/verifyToken')

const captainRouter = Router()

captainRouter.post('/updateToken', verifyToken, async (req, res) => {
    const registrationToken = req.body.token
    const uid = req.user.uid

    try {
        await db.collection('captains').doc(uid).update({ registrationToken })
        return res.json({ success: "Token updated successfully" })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = captainRouter