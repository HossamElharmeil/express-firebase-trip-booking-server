const BusBoy = require('busboy')
const path = require('path')
const os = require('os')
const fs = require('fs')
const Router = require('express').Router
const verifyToken = require('../../middleware/verifyToken')
const db = require('firebase-admin').firestore()
const imageRouter = Router()

imageRouter.get('/getImages', verifyToken, async (req, res) => {
    const uid = req.user.uid
    try {
        const imageQuery = await db.collection('images').doc(uid).get().data()
        res.json(imageQuery)
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
})

imageRouter.post('/uploadImage', verifyToken, async (req, res) => {
    const busboy = new BusBoy({ headers: req.headers });
    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file',  (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') 
            return res.status(400).json({ error: 'Unsupported file format' })
        
        const imageExtension = path.extname(filename);
        imageFileName = `${Math.round(Math.random() * 100000000000)}${imageExtension}`
        const filepath = path.join(os.tmpdir(), imageFileName)

        imageToBeUploaded = { filepath, mimetype }

        file.pipe(fs.createWriteStream(filepath))
    });

    busboy.on('finish', async () => {
        try {
            await admin.storage().bucket(config.storageBucket).upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype
                    }
                }
            })
            const imageUrl =
                `https://firebasestorage.googleapis.com/v0/b/
                ${config.storageBucket}
                /o/
                ${imageFileName}
                ?alt=media`
            
            const imageQuery = await db.collection('images').doc(req.user.uid).get().data()
            const images = imageQuery.images || []
            images.concat([imageUrl])
            await db.collection('images').doc(req.user.uid).update({ images })

            return res.json({ message: 'Image uploaded successfully' })
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Something went wrong' })
        }
    });
    
    req.pipe(busboy)
})

module.exports = imageRouter
