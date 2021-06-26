const Router = require('express').Router
const db = require('firebase-admin').firestore()

const financeRouter = Router()

financeRouter.get('/getPayments', async (_, res) => {
    try {
        const paymentsQuery = await db.collection('payments').get()
        const payments = paymentsQuery.docs.map(doc => doc.data())
    
        return res.json(payments)
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

financeRouter.get('/getDebt', async (_, res) => {
    let debt = 0

    try {
        const walletQuery = await db.collection('wallets').get()
        
        walletQuery.docs.forEach(doc => {
            debt += doc.data().amount ?? 0
        })

        return res.json({ debt })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

financeRouter.get('/getFinance', async (_, res) => {
    try {
        const payments = (await db.collection('payments').get()).docs.map(doc => doc.data())
        
        let debt = 0
        const walletQuery = await db.collection('wallets').get()
        walletQuery.docs.forEach(doc => {
            debt += doc.data().amount ?? 0
        })
    
        return res.json({ payments, debt })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = financeRouter
