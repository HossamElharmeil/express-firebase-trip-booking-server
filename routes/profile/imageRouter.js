const BusBoy = require('busboy')
const config = require('../../util/config').firebaseConfig
const Router = require('express').Router
const fs = require('fs')
const os = require('os')
const path = require('path')
const verifyToken = require('../../middleware/verifyToken')

const db = require('firebase-admin').firestore()
const auth = require('firebase-admin').auth()
const storage = require('firebase-admin').storage()

const imageRouter = Router()

imageRouter.use(verifyToken)

imageRouter.get('/getImages', async (req, res) => {
    const uid = req.user.uid
    try {
        const imageQuery = (await db.collection('images').doc(uid).get()).data()
        res.json(imageQuery)
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
})

imageRouter.post('/uploadImage', async (req, res) => {
    const uid = req.user.uid
    
    let imageFileName
    let imageToBeUploaded = {}

    req.busboy.on('file',  (_, file, filename, __, mimetype) => {
        if (mimetype !== 'image/png' && mimetype !== 'image/jpeg' && mimetype !== 'image/jpg') 
            return res.status(400).json({ error: 'Unsupported file format' })
        
        const imageExtension = path.extname(filename)
        imageFileName = `${Math.round(Math.random() * 100000000000)}${imageExtension}`
        const filepath = path.join(os.tmpdir(), imageFileName)

        imageToBeUploaded = { filepath, mimetype }

        file.pipe(fs.createWriteStream(filepath))
    })

    req.busboy.on('finish', async () => {
        try {
            await storage.bucket(config.storageBucket).upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype
                    }
                }
            })
            const photoURL =
                `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
            
            const imageQuery = (await db.collection('images').doc(uid).get()).data()
            const currentImages = imageQuery?.images ? imageQuery.images : []

            if (currentImages.length === 0) {
                await db.collection('captains').doc(uid).update({ photoURL })

                const images = [ ...currentImages, photoURL ]
                await db.collection('images').doc(uid).set({ images })
            }
            else {
                const images = [ ...currentImages, photoURL ]
                await db.collection('images').doc(uid).update({ images })
            }

            return res.json({ message: 'Image uploaded successfully', photoURL })
        }
        catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Something went wrong' })
        }
    })
    
    req.pipe(req.busboy)
})

imageRouter.post('/uploadProfile', (req, res) => {
    const uid = req.user.uid
    
    let imageFileName
    let imageToBeUploaded = {}

    req.busboy.on('file',  (_, file, filename, __, mimetype) => {
        if (mimetype !== 'image/png' && mimetype !== 'image/jpeg' && mimetype !== 'image/jpg') 
            return res.status(400).json({ error: 'Unsupported file format' })
        
        const imageExtension = path.extname(filename)
        imageFileName = `${Math.round(Math.random() * 100000000000)}${imageExtension}`
        const filepath = path.join(os.tmpdir(), imageFileName)

        imageToBeUploaded = { filepath, mimetype }

        file.pipe(fs.createWriteStream(filepath))
    });

    req.busboy.on('finish', async () => {
        try {
            await storage.bucket(config.storageBucket).upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype
                    }
                }
            })
            const photoURL =
                `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
            
            await auth.updateUser(uid, { photoURL })
            await db.collection('users').doc(uid).update({ photoURL })

            return res.json({ message: 'Image uploaded successfully', photoUrl })
        }
        catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Something went wrong' })
        }
    })
    
    req.pipe(req.busboy)
})

module.exports = imageRouter
