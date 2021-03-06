const Router = require('express').Router
const verifyToken = require('../../middleware/verifyToken')
const db = require('firebase-admin').firestore()
const auth = require('firebase-admin').auth()
const messaging = require('../../services/messaging')

const registerRouter = Router()

registerRouter.use(verifyToken)

registerRouter.post('/registerCaptain', async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const newData = {
        captainId: req.user.uid,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email,
        type: req.body.type,
        registrationToken: req.body.registrationToken,
        verified: false
    }

    try {
        await db.collection('captains').doc(req.user.uid).set(newData)
        await auth.updateUser(req.user.uid, {
            email: email,
            password: password,
            displayName: `${newData.firstName} ${newData.lastName}`
        })

        await messaging.subscribe(req.body.registrationToken, 'captains')

        return res.json({ success: 'Captain data updated' })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message, code: error.code })
    }
})

registerRouter.post('/registerUser', async (req, res) => {
    const newData = {
        uid: req.user.uid,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        points: 0,
        registrationToken: req.body.registrationToken
    }

    try {
        await db.collection('users').doc(req.user.uid).set(newData)
        await auth.updateUser(req.user.uid, {
            email: req.body.email,
            password: req.body.password,
            displayName: `${newData.firstName} ${newData.lastName}`
        })

        await messaging.subscribe(req.body.registrationToken, 'users')

        return res.json({ success: 'User data updated' })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = registerRouter