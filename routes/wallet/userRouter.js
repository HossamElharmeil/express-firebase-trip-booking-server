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

userRouter.post('/withdraw', async (req, res) => {
    const uid = req.user.uid
    const amount = req.body.amount
    const account = req.body.account

    try {
        const wallet = (await db.collection('wallets').doc(uid).get()).data()
        
        const newAmount = wallet.amount - amount
        await db.collection('wallets').doc(uid).set({ amount: newAmount })
        
        const transaction = {
            uid,
            amount,
            account,
            type: 'withdraw'
        }
        await db.collection('transactions').add(transaction)

        return res.json({ success: 'Transaction done successfully' })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = userRouter