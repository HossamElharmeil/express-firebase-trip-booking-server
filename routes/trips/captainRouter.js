const db = require('firebase-admin').firestore()
const verifyToken = require("../../middleware/verifyToken")

const Router = require('express').Router

const captainRouter = Router()
captainRouter.use(verifyToken)

captainRouter.put('/acceptTrip', async (req, res) => {
    const tripId = req.body.tripId
    
    try {
        const trip = (await db.collection('trips').doc(tripId).get()).data()
        if (trip.captainId === req.user.uid) {
            await db.collection('trips').doc(tripId).update({ status: 'accepted' })
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
        if (trip.captainId === req.user.uid) {
            await db.collection('trips').doc(tripId).update({ status: 'rejected' })
            await db.collection('captains').doc(req.user.uid).update({ available: true })

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
        if (trip.captainId === req.user.uid) {
            await db.collection('trips').doc(tripId).update({ status: 'finished' })
            await db.collection('captains').doc(req.user.uid).update({ available: true })
            
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

module.exports = captainRouter