const db = require('firebase-admin').firestore()
const verifyToken = require("../../middleware/verifyToken")

const Router = rquire('express').Router

const tripsRouter = Router()
tripsRouter.use(verifyToken)

tripsRouter.post('/reserveTrip', (req, res) => {
    const newTrip = {
        user: req.user.uid,
        captain: req.body.captainId,
        status: 'new',
        pickup: req.body.pickup,
        dropoff: req.body.dropoff,
        type: req.body.type,
        rating: 0,
        createdAt: Date.toISOString(Date.now())
    }

    try {
        const captain = await db.collection('captains').doc(req.body.captainId).get().data()

        if (captain.available === true) {
            const newTrip = await db.collection('trips').add(newTrip)
            const id = newTrip.id

            await db.collection('captains').doc(req.body.captainId).update({ available: false })

            res.json({ success: 'Trip added successfully', id })
        }
        else {
            res.json({ error: 'Captain reserved'})
        }
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
})

tripsRouter.post('/rateTrip', (req, res) => {
    const tripId = req.body.tripId
    const rating = req.body.rating
    
    try {
        const trip = (await db.collection('trips').doc(tripId).get()).data()

        if (trip.captainId === req.user.uid && trip.status === 'finished') {
            await db.collection('trips').doc(tripId).update({ rating })
            res.json({ success: 'Rating added successfully' })
        }
        else {
            res.status(403).json({ error: 'Unauthorized operation' })
        }
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = tripsRouter