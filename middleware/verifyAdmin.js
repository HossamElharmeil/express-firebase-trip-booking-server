const db = require('firebase-admin').firestore()
const auth = require('firebase-admin').auth()

const verifyAdmin = async (req, res, next) => {
    let idToken
    if (req.headers.authorization == null || !req.headers.authorization.startsWith('Bearer ')) {
        console.log('Unrecognized token format')
        return res.status(400).json({ error: 'Unauthorized operation' })
    }
    else {
        idToken = req.headers.authorization.split('Bearer ')[1]
    }
    try {
        const decodedToken = await auth.verifyIdToken(idToken)
        req.user = decodedToken

        const adminQuery = await db.collection('admins').where('uid', '==', decodedToken.uid).get()
        if (adminQuery.docs.length === 0) {
            return res.status(403).json({ error: 'Unauthorized' })
        }

        return next()
    }
    catch (error) {
        console.error(error)
        return res.status(403).json(error)
    }
}

module.exports = verifyAdmin