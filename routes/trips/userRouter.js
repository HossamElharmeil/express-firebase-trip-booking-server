const db = require('firebase-admin').firestore()
const verifyToken = require("../../middleware/verifyToken")
const toISOString = require('isodate-lite').convertDatesToISOStrings
const estimatePrice = require('./util/estimatePrice')

const Router = require('express').Router

const tripsRouter = Router()
tripsRouter.use(verifyToken)

tripsRouter.post('/reserveTrip', async (req, res) => {
    let newTrip = {
        captainId: req.body.captainId,
        status: 'new',
        pickup: req.body.pickup,
        dropoff: req.body.dropoff,
        type: req.body.type,
        rating: 0,
        notes: req.body.notes || '',
        estimatePrice: estimatePrice(req.body.dropoff, req.body.pickup),
        createdAt: toISOString(Date.now())
    }

    try {
        const captain = (await db.collection('captains').doc(req.body.captainId).get()).data()
        const user = (await db.collection('users').doc(req.user.uid).get()).data()

        newTrip.user = user

        if (!captain) {
            return res.status(404).json({ error: 'Captain not found' })
        }

        if ((captain.available || false) === true) {
            const newTripDocument = await db.collection('trips').add(newTrip)
            newTrip.id = newTripDocument.id

            await db.collection('captains').doc(req.body.captainId).update({ available: false })

            return res.json({ success: 'Trip added successfully', newTrip })
        }
        else {
            return res.json({ error: 'Captain reserved'})
        }
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

tripsRouter.post('/rateTrip', async (req, res) => {
    const tripId = req.body.tripId
    const rating = req.body.rating
    const review = req.body.review || ''
    
    try {
        const trip = (await db.collection('trips').doc(tripId).get()).data()

        if (trip.captainId === req.user.uid && trip.status === 'finished') {
            await db.collection('trips').doc(tripId).update({ rating, review })
            return res.json({ success: 'Rating added successfully' })
        }
        else {
            return res.status(403).json({ error: 'Unauthorized operation' })
        }
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

tripsRouter.post('/addCuppon', async (req, res) => {
    const cupponCode = req.body.code
    const tripId = req.body.tripId

    try {
        const cupponQuery = await db.collection('cuppons').where('code', '==', cupponCode).get()

        if (cupponQuery.docs.length === 0) {
            return res.status(404).json({ error: 'Invalid cuppon' })
        }
        else {
            const cupponData = cupponQuery.docs[0].data()
            const tripData = (await db.collection('trips').doc(tripId).get()).data()

            const estimatePrice = tripData.estimatePrice - tripData.estimatePrice * cupponData.percentage

            await db.collection('trips').doc(tripId).update({ estimatePrice })

            return res.json({ success: 'Cuppon added' })
        }
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = tripsRouter