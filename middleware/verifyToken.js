const admin = require('firebase-admin')

module.exports = async (req, res, next) => {
    let idToken
    if (req.headers.authorization == null || !req.headers.authorization.startsWith('Bearer ')) {
        console.log('Unrecognized token format')
        return res.status(400).json({ error: 'Unauthorized operation' })
    }
    else {
        idToken = req.headers.authorization.split('Bearer ')[1]
    }
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        req.user = decodedToken
        return next()
    }
    catch (error) {
        console.error(error)
        return res.status(403).json(error)
    }
}