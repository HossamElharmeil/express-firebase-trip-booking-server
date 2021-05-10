const Router = require('express').Router
const db = require('firebase-admin').firestore()

const usersRouter = Router()

usersRouter.get('/getUsers', async (req, res) => {
    const usersQuery = await db.collection('users').get()
    const users = usersQuery.docs.map(doc => doc.data())

    res.json(users)
})

module.exports = usersRouter