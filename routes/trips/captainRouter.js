const db = require('firebase-admin').firestore()
const verifyToken = require("../../middleware/verifyToken")
const messaging = require('../../services/index').messaging
const deleteCollection = require('../../services/db')

const Router = require('express').Router

const captainRouter = Router()
captainRouter.use(verifyToken)

captainRouter.get('/getPreviousTrips', async (req, res) => {
    const uid = req.user.uid

    try {
        const tripsQuery = await db.collection('trips')
            .where('captainId', '==', uid)
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

captainRouter.get('/getCurrentTrip', async (req, res) => {
    const uid = req.user.uid

    try {
        const tripsQuery = await db.collection('trips')
            .where('captainId', '==', uid)
            .where('status', 'not-in', ['rejected', 'cancelled', 'finished'])
            .get()
        
        const trip = tripsQuery.docs[0].data()

        return res.json({ trip })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error })
    }
})

captainRouter.put('/acceptTrip', async (req, res) => {
    const tripId = req.body.tripId
    
    try {
        const trip = (await db.collection('trips').doc(tripId).get()).data()
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' })
        }
        
        const user = (await db.collection('users').doc(trip.user.uid).get()).data()
        
        if (trip.captainId === req.user.uid) {
            await deleteCollection(db, `users/${user.uid}/captains`, 100)
            await db.collection('trips').doc(tripId).update({ status: 'accepted' })
            await db.collection('captains').doc(req.user.uid).update({ available: false })

            if (user.registrationToken) {
                await messaging.sendMessage(user.registrationToken, {
                    notification: {
                        title: 'Driver Found',
                        body: 'A driver accepted your trip!'
                    },
                    data: {
                        click_action: "FLUTTER_NOTIFICATION_CLICK",
                        type: 'trip_accepted',
                        captainId: req.user.uid,
                        tripId
                    }
                })
            }

            res.json({ success: 'Trip accepted successfully' })
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

captainRouter.put('/rejectTrip', async (req, res) => {
    const tripId = req.body.tripId
    
    try {
        const trip = (await db.collection('trips').doc(tripId).get()).data()
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' })
        }

        const user = (await db.collection('users').doc(trip.user.uid).get()).data()

        if (trip.captainId === req.user.uid) {
            await db.collection('captains').doc(req.user.uid).update({ available: true })
            await db.collection('users').doc(trip.user.uid).collection('captains').doc(trip.captainId).delete()

            const nearbyCaptainsQuery = await db.collection('users').doc(trip.user.uid).collection('captains').get()
            const nearbyCaptains = nearbyCaptainsQuery.docs.map(doc => doc.data())

            if (nearbyCaptains.length === 0)
                await messaging.sendMessage(user.registrationToken, {
                    notification: {
                        title: 'No Drivers Found',
                        body: 'Your trip has been cancelled by the driver'
                    },
                    data: {
                        click_action: "FLUTTER_NOTIFICATION_CLICK",
                        type: 'not_found',
                        tripId
                    }
                })
            
            else {
                await db.collection(trips).doc(tripId).update({ captain: nearbyCaptains[0], captainId: nearbyCaptains[0].captainId})
                await messagingService.sendMessage(nearbyCaptains[0].registrationToken, {
                    notification: {
                        title: 'New Trip',
                        body: 'There is a new trip reservation waiting for you!'
                    },
                    data: {
                        click_action: "FLUTTER_NOTIFICATION_CLICK",
                        type: 'new_trip',
                        captainId: nearbyCaptains[0].captainId,
                        status: 'new',
                        trip_type: trip.type,
                        notes: trip.notes,
                        createdAt: trip.createdAt,
                        tripId
                    }
                })
            }

            res.json({ success: 'Trip rejected successfully' })
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

captainRouter.put('/finishTrip', async (req, res) => {
    const tripId = req.body.tripId
    
    try {
        const trip = (await db.collection('trips').doc(tripId).get()).data()
        const user = (await db.collection('users').doc(trip.user.uid).get()).data()

        if (trip.captainId === req.user.uid) {
            await db.collection('trips').doc(tripId).update({ status: 'finished' })
            await db.collection('captains').doc(req.user.uid).update({ available: true })

            if (user.registrationToken) {
                await messaging.sendMessage(user.registrationToken, {
                    notification: {
                        title: 'You Arrived',
                        body: 'You arrived at your destination'
                    },
                    data: {
                        click_action: "FLUTTER_NOTIFICATION_CLICK",
                        type: 'trip_finished',
                        captainId: req.user.uid,
                        tripId
                    }
                })
            }
            
            res.json({ success: 'Trip ended successfully' })
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

captainRouter.put('/startTrip', async (req, res) => {
    const tripId = req.body.tripId
    
    try {
        const trip = (await db.collection('trips').doc(tripId).get()).data()
        const user = (await db.collection('users').doc(trip.user.uid).get()).data()

        if (trip.captainId === req.user.uid) {
            await db.collection('trips').doc(tripId).update({ status: 'started' })

            if (user.registrationToken) {
                await messaging.sendMessage(user.registrationToken, {
                    notification: {
                        title: 'Captain Arrived',
                        body: 'Your captain arrived at the pickup location'
                    },
                    data: {
                        click_action: "FLUTTER_NOTIFICATION_CLICK",
                        type: 'trip_started',
                        captainId: req.user.uid,
                        tripId
                    }
                })
            }
            
            res.json({ success: 'Trip started successfully' })
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

captainRouter.post('/rateClient', async (req, res) => {
    const rating = req.body.rating
    const uid = req.body.uid

    try {
        const user = (await db.collection('users').doc(uid).get()).data()

        let ratingSum = user.ratingSum ?? 0 + rating
        let ratingCount = user.ratingCount ?? 0 + 1
        let ratingAverage = ratingSum / ratingCount

        await db.collection('users').doc(uid).update({
            ratingCount,
            ratingSum,
            ratingAverage
        })

        return res.json({ success: 'Client rated successfully' })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

captainRouter.post('/toggleAvailable', async (req, res) => {
    const uid = req.user.uid
    try {
        const captain = (await db.collection('captains').doc(uid).get()).data()
        await db.collection('captains').doc(uid).update({ available: !captain.available })

        return res.json({ success: "Toggle done successfully" })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = captainRouter