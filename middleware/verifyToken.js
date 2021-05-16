const auth = require('firebase-admin').auth()

const verifyToken = async (req, res, next) => {
    console.log(req.get('Authorizattion'))

    const token = req.get('Authorization').split('Bearer ')[1]

    if (!token || !token.startsWith('Bearer ')) {
        console.log(token)
        return res.status(403).json({ error: 'Authorization failed' })
    }
    
    try {
        const user = await auth.verifyIdToken(token)
        req.user = user
        return next()
    }
    catch (error) {
        console.log(token)
        return res.status(403).json({ error: 'Authorization failed' })
    }
}

module.exports = verifyToken