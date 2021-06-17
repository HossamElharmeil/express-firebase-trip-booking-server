const { Router } = require("express")
const db = require('firebase-admin').firestore()
const verifyToken = require('../../middleware/verifyToken')

const charityRouter = Router()
charityRouter.use(verifyToken)

charityRouter.get('/getCharities', async (_, res) => {
    try {
        const charitiesQuery = await db.collection('charities').get()

        const charities = charitiesQuery.docs.map(doc => {
            const data = doc.data()
            data.id = doc.id
            return data
        })

        return res.json(charities)
    }
    catch (error) {
        console.error(error)
        return res.json({ error: 'Something went wrong' })
    }
})

charityRouter.post('/addDonation', async (req, res) => {
    const charityId = req.body.charityId

    const newDonation = {
        amount: req.body.amount,
        uid: req.user.uid,
        createdAt: new Date().getTime()
    }

    try {
        await db.collection('charities').doc(charityId).collection('donations').add(newDonation)

        return res.json({ success: 'Donation added successfully' })
    }
    catch (error) {
        console.error(error)
        return res.json({ error: 'Something went wrong' })
    }
})

module.exports = charityRouter