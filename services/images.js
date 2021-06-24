const BusBoy = require('busboy')
const config = require('../util/config').firebaseConfig
const fs = require('fs')
const os = require('os')
const path = require('path')
const storage = require('firebase-admin').storage()

exports.uploadImage = async (req) => {
    const busboy = new BusBoy({ headers: req.headers })
    let imageFileName
    let imageToBeUploaded = {}

    busboy.on('file',  (_, file, filename, __, mimetype) => {
        if (mimetype !== 'image/png' && mimetype !== 'image/jpeg' && mimetype !== 'image/jpg') 
            throw Error('Unsupported format')
        
        const imageExtension = path.extname(filename)
        imageFileName = `${Math.round(Math.random() * 100000000000)}${imageExtension}`
        const filepath = path.join(os.tmpdir(), imageFileName)

        imageToBeUploaded = { filepath, mimetype }

        file.pipe(fs.createWriteStream(filepath))
    });

    busboy.on('finish', async () => {
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

            return photoURL
        }
        catch (error) {
            throw Error('Image upload error')
        }
    })
    
    req.pipe(busboy)
}