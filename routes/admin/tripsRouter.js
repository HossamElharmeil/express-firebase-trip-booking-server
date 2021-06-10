const Router = require('express').Router
const db = require('firebase-admin').firestore()

const tripsRouter = Router()

tripsRouter.get('/getTrips', async (req, res) => {
    const tripsQuery = await db.collection('trips').get()
    const trips = tripsQuery.docs.map(doc => {
        const data = doc.data()
        data.id = doc.id
        return data
    })

    res.json(trips)
})

tripsRouter.post('/getTrip', async (req, res) => {
    const id = req.body.id

    const tripQuery = await db.collection('trips').doc(id).get()

    const trip = tripQuery.data()
    trip.id = tripQuery.id

    return res.json(trip)
})

module.exports = tripsRouter
