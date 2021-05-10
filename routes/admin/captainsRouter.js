const Router = require('express').Router
const db = require('firebase-admin').firestore()

const captainsRouter = Router()

captainsRouter.get('/getCaptains', async (req, res) => {
    const captainsQuery = await db.collection('captains').get()
    const captains = captainsQuery.docs.map(doc => doc.data())

    res.json(captains)
})

captainsRouter.post('/verifyCaptain', async (req, res) => {
    const captainId = req.body.captainId
    try {
        await db.collection('captains').doc(captainId).set({ verified: true })
        res.json({ success: 'Captain verified' })
    }
    catch (error) {
        console.error(error)
        res.status(500).json("Something went wrong")
    }
})

module.exports = captainsRouter