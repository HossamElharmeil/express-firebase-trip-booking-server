const Router = require('express').Router
const db = require('firebase-admin').firestore()
const auth = require('firebase-admin').auth()

const usersRouter = Router()

usersRouter.get('/getUsers', async (req, res) => {
    const usersQuery = await db.collection('users').get()
    const users = usersQuery.docs.map(doc => doc.data())

    res.json(users)
})

usersRouter.delete('/deleteUser', async (req, res) => {
    const uid = req.body.uid
    try {
        await db.collection('users').doc(uid).delete()
        await auth.deleteUser(uid)

        res.json({ success: "User deleted" })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: "Something went wrong" })
    }
})

module.exports = usersRouter