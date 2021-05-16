const Router = require('express').Router
const verifyToken = require('../../middleware/verifyToken')
const db = require('firebase-admin').firestore()
const auth = require('firebase-admin').auth()

const registerRouter = Router()

registerRouter.use(verifyToken)

registerRouter.post('/registerCaptain', async (req, res) => {
    const newData = {
        uid: req.user.uid,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password,
        type: req.body.type,
        verified: false
    }

    try {
        await db.collection('captains').doc(req.user.uid).set(newData)
        await auth.updateUser(req.user.uid, {
            email: newData.email,
            password: newData.password
        })

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
        email: req.body.email
    }

    try {
        await db.collection('users').doc(req.user.uid).set(newData)
        await auth.updateUser(req.user.uid, {
            email: req.body.email,
            password: req.body.password
        })
        return res.json({ success: 'User data updated' })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = registerRouter