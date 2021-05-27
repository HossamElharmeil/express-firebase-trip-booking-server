const db = require('firebase-admin').firestore()
const verifyToken = require("../../middleware/verifyToken")
const messaging = require('../../services/index').messaging

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

captainRouter.put('/acceptTrip', async (req, res) => {
    const tripId = req.body.tripId
    
    try {
        const trip = (await db.collection('trips').doc(tripId).get()).data()
        const user = (await db.collection('users').doc(trip.user.uid).get()).data()
        
        if (trip.captainId === req.user.uid) {
            await db.collection('trips').doc(tripId).update({ status: 'accepted' })

            if (user.registrationToken) {
                await messaging.sendMessage(user.registrationToken, {
                    notification: {
                        title: 'Driver Found',
                        body: 'A driver accepted your trip!'
                    },
                    data: {
                        click_action: "FLUTTER_NOTIFICATION_CLICK",
                        type: 'trip_accepted',
                        captainId: req.body.captainId,
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
        const user = (await db.collection('users').doc(trip.user.uid).get()).data()

        if (trip.captainId === req.user.uid) {
            await db.collection('trips').doc(tripId).update({ status: 'rejected' })
            await db.collection('captains').doc(req.user.uid).update({ available: true })

            if (user.registrationToken) {
                await messaging.sendMessage(user.registrationToken, {
                    notification: {
                        title: 'Trip Cancelled',
                        body: 'Your trip has been cancelled by the driver'
                    },
                    data: {
                        click_action: "FLUTTER_NOTIFICATION_CLICK",
                        type: 'trip_cancelled',
                        captainId: req.body.captainId,
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
                        captainId: req.body.captainId,
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
        await db.collection('captains').doc(req.user.uid).update({ available: true })

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
                        captainId: req.body.captainId,
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

captainRouter.post('/toggleAvailable', async (req, res) => {
    const uid = req.user.uid
    try {
        const captain = (await db.collection('captains').doc(uid).get()).data()
        await db.collection('captains').doc(uid).update({ available: !captain.available ?? true })

        return res.json({ success: "Toggle done successfully" })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = captainRouter