const db = require('firebase-admin').firestore()
const Router = require('express').Router
const verifyToken = require('../../middleware/verifyToken')

const getRouter = Router()

getRouter.use(verifyToken)

getRouter.get('/getUser', async (req, res) => {
    const uid = req.user.uid

    try {
        const usersQuery = await db.collection('users').where('uid', '==', uid).get()
        if (usersQuery.docs.length === 0) {
            return res.status(404).json({ result: 'User not found' })
        }
        else {
            const user = usersQuery.docs[1].data()
            return res.json({ user })
        }
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
})

getRouter.get('/getCaptain', async (req, res) => {
    const uid = req.user.uid

    try {
        const usersQuery = await db.collection('captains').where('captainId', '==', uid).get()
        if (usersQuery.docs.length === 0) {
            return res.status(404).json({ result: 'Captain not found' })
        }
        else {
            const captain = usersQuery.docs[1].data()
            return res.json({ captain })
        }
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = getRouter