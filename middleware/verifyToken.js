const auth = require('firebase-admin').auth()

const verifyToken = async (req, res, next) => {
    const token = req.get('Authorization').split('Bearer ')[1]

    if (!token) {
        return res.status(403).json({ error: 'Authorization failed' })
    }
    
    try {
        const user = await auth.verifyIdToken(token)
        req.user = user
        return next()
    }
    catch (error) {
        return res.status(403).json({ error: 'Authorization failed' })
    }
}

module.exports = verifyToken