const Router = require('express').Router
const auth = require('firebase').auth()
const verifyToken = require('../../middleware/verifyToken')

const authRouter = Router()

authRouter.post('/verifyPassword', verifyToken, async (req, res) => {
    const email = req.user.email
    const password = req.body.password

    try {
        const userCredential = auth.signInWithEmailAndPassword(email, password)
        const token = await userCredential.getIdToken()

        res.json({ token })
    }
    catch (error) {
        res.status(403).json({ error: 'Authentication failed' })
    }
})

module.exports = authRouter