const Router = require('express').Router
const db = require('firebase-admin').firestore()
const verifyToken = require('../../middleware/verifyToken')
const userRouter = Router()

userRouter.use(verifyToken)

userRouter.get('/getWallet', async (req, res) => {
    const uid = req.user.uid

    try {
        const wallet = (await db.collection('wallets').doc(uid).get()).data()

        res.json({ wallet })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = userRouter