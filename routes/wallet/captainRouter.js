const Router = require('express').Router
const db = require('firebase-admin').firestore()
const verifyToken = require('../../middleware/verifyToken')
const captainRouter = Router()

captainRouter.use(verifyToken)

captainRouter.post('/addToWallet', async (req, res) => {
    const uid = req.body.uid
    const captainId = req.user.uid
    const amount = req.body.amount

    try {
        const captainQuery = await db.collection('captains').where('captainId', '==', captainId).get()
        const userQuery = await db.collection('users').where('uid', '==', uid).get()

        if (captainQuery.docs.length == 0) {
            return res.status(403).json({ error: 'Unauthorized operation' })
        }
        if (userQuery.length == 0) {
            return res.status(404).json({ error: 'User not found' })
        }

        const oldAmount = (await db.collection('wallets').doc(uid).get()).data().amount || 0

        const newAmount = oldAmount + amount

        await db.collection('wallets').doc(uid).set({ amount: newAmount })

        return res.json({ success: 'Amount added successfully' })
    }
    catch(error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

captainRouter.post('/addPayment', async (req, res) => {
    const amount = req.body.amount
    const tripId = req.body.tripId
    const wallet = req.body.wallet

    try {
        const trip = (await db.collection('trips').doc(tripId).get()).data()

        await db.collection('payments').add({
            amount,
            status: 'pending',
            createdAt: new Date().getTime()
        })

        if (wallet != 0) {
            const wallet = (await db.collection('wallets').doc(trip.user.uid).get()).data()
            await db.collection('wallets').doc(trip.user.uid).update({
                amount: wallet?.amount || 0 + amount
            })
        }

        return res.json({ success: 'Payment done successfully' })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

captainRouter.post('/withdraw', async (req, res) => {
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

module.exports = captainRouter