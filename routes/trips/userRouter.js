const db = require('firebase-admin').firestore()
const verifyToken = require("../../middleware/verifyToken")
const toISOString = require('isodate-lite').convertDatesToISOStrings
const estimatePrice = require('./util/estimatePrice')
const messagingService = require('../../services/index').messaging

const Router = require('express').Router

const userRouter = Router()
userRouter.use(verifyToken)

userRouter.get('/getPreviousTrips', async (req, res) => {
    const uid = req.user.uid

    try {
        const tripsQuery = await db.collection('trips')
            .where('user.uid', '==', uid)
            .where('status', '==', 'finished')
            .get()

        const trips = tripsQuery.docs.map(trip => trip.data())

        res.json({ trips })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
})

userRouter.post('/reserveTrip', async (req, res) => {
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
        if (!captain) {
            return res.status(404).json({ error: 'Captain not found' })
        }

        const user = (await db.collection('users').doc(req.user.uid).get()).data()
        newTrip.user = user
        newTrip.captain = captain

        if (captain.available === true) {
            const newTripDocument = await db.collection('trips').add(newTrip)
            newTrip.id = newTripDocument.id

            await db.collection('captains').doc(req.body.captainId).update({ available: false })
            if (captain.registrationToken) {
                await messagingService.sendMessage(captain.registrationToken, {
                    notification: {
                        title: 'New Trip',
                        body: 'There is a new trip reservation waiting for you!'
                    },
                    data: {
                        click_action: "FLUTTER_NOTIFICATION_CLICK",
                        type: 'new_trip',
                        captainId: req.body.captainId,
                        status: 'new',
                        trip_type: req.body.type,
                        notes: req.body.notes || '',
                        createdAt: toISOString(Date.now()).toString(),
                        tripId: newTrip.id
                    }
                })
            }

            return res.json({ success: 'Trip added successfully', newTrip })
        }
        else {
            return res.status(403).json({ error: 'Captain reserved'})
        }
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

userRouter.put('/cancelTrip', async (req, res) => {
    const tripId = req.body.tripId
    
    try {
        const trip = (await db.collection('trips').doc(tripId).get()).data()
        const captain = (await db.collection('captains').doc(trip.captainId).get()).data()

        if (trip.user.uid === req.user.uid) {
            await db.collection('trips').doc(tripId).update({ status: 'cancelled' })
            await db.collection('captains').doc(trip.captainId).update({ available: true })

            if (captain.registrationToken) {
                await messaging.sendMessage(captain.registrationToken, {
                    notification: {
                        title: 'Trip Cancelled',
                        body: 'Your trip has been cancelled by the user'
                    },
                    data: {
                        click_action: "FLUTTER_NOTIFICATION_CLICK",
                        type: 'trip_cancelled',
                        captainId: req.body.captainId,
                        tripId
                    }
                })
            }

            return res.json({ success: 'Trip cancelled successfully' })
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

userRouter.post('/estimatePrice', (req, res) => {
    const pickup = req.body.pickup
    const dropoff = req.body.dropoff

    const estimatePriceCalculation = estimatePrice(pickup, dropoff);

    return res.json({ estimatePrice: estimatePriceCalculation })
})

userRouter.post('/rateTrip', async (req, res) => {
    const uid = req.user.uid
    const tripId = req.body.tripId
    const rating = req.body.rating
    const review = req.body.review || ''
    
    try {
        const trip = (await db.collection('trips').doc(tripId).get()).data()
        const captain = (await db.collection('captains').doc(uid).get()).data()

        if (trip.captainId === req.user.uid && trip.status === 'finished') {
            await db.collection('trips').doc(tripId).update({ rating, review })
            
            const newSum = captain.ratingSum || 0 + rating
            const newCount = captain.ratingCount || 0 + 1
            const newAverage = newSum / newCount

            await db.collection('captains').doc(uid).update({
                ratingAverage: newAverage,
                ratingSum: newSum,
                ratingCount: newCount
            })
            
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

userRouter.post('/addCuppon', async (req, res) => {
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

module.exports = userRouter