const Router = require('express').Router
const db = require('firebase-admin').firestore()
const auth = require('firebase-admin').auth()

const tripsRouter = Router()

tripsRouter.get('/getTrips', async (req, res) => {
    const tripsQuery = await db.collection('trips').get()
    const trips = tripsQuery.docs.map(doc => doc.data())

    res.json(trips)
})

module.exports = tripsRouter
