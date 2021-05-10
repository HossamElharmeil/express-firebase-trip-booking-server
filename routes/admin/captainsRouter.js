const Router = require('express').Router
const db = require('firebase-admin').firestore()

const captainsRouter = Router()

captainsRouter.get('/getCaptains', async (req, res) => {
    const captainsQuery = await db.collection('captains').get()
    const captains = captainsQuery.docs.map(doc => doc.data())

    res.json(captains)
})



module.exports = captainsRouter