const Router = require('express').Router
const auth = require('firebase').auth()
const verifyToken = require('../../middleware/verifyToken')

const authRouter = Router()

authRouter.post('/verifyPassword', verifyToken, async (req, res) => {
    const email = req.user.email
    const password = req.body.password

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password)
        const token = await userCredential.user.getIdToken()

        res.json({ token })
    }
    catch (error) {
        res.status(403).json({ error: 'Authentication failed' })
    }
})

authRouter.post('/loginWithEmail', async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password)
        console.log(userCredential)
        const token = await userCredential.user.getIdToken()

        res.json({ token })
    }
    catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
})

module.exports = authRouter