const Router = require('express').Router
const db = require('firebase-admin').firestore()
const auth = require('firebase-admin').auth()

const captainsRouter = Router()

captainsRouter.get('/getCaptains', async (req, res) => {
    const captainsQuery = await db.collection('captains').get()
    const captains = captainsQuery.docs.map(doc => doc.data())

    res.json(captains)
})

captainsRouter.post('/getCaptain', async (req, res) => {
    const uid = req.body.uid

    const captain = (await db.collection('captains').doc(uid).get()).data()

    return res.json(captain)
})

captainsRouter.put('/verifyCaptain', async (req, res) => {
    const captainId = req.body.captainId
    try {
        await db.collection('captains').doc(captainId).update({ verified: true })
        res.json({ success: 'Captain verified' })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "Something went wrong" })
    }
})

captainsRouter.delete('/deleteCaptain', async (req, res) => {
    const captainId = req.body.captainId
    try {
        await db.collection('captains').doc(captainId).delete()
        await auth.deleteUser(captainId)
        
        res.json({ success: "Captain removed" })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "Something went wrong" })
    }
})

captainsRouter.put('/changeSegment', async (req, res) => {
    const segmentId = req.body.segment
    const captainId = req.body.captainId

    try {
        await db.collection('captains').doc(captainId).update({ segmentId })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = captainsRouter