const Router = require('express').Router
const db = require('firebase-admin').firestore()

const charityRouter = Router()

charityRouter.get('/getCharities', async (_, res) => {
    try {
        const charitiesQuery = await db.collection('charities').get()

        const charities = charitiesQuery.docs.map(doc => doc.data())

        return res.json(charities)
    }
    catch (error) {
        console.error(error)
        return res.json({ error: 'Something went wrong' })
    }
})

charityRouter.post('/addCharity', async (req, res) => {
    const newCharity = {
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        photoURL: req.body.photoURL,
        totalDonations: 0,
        donationsCount: 0
    }

    try {
        await db.collection('charities').add(newCharity)

        return res.json({ success: 'Charity added successfully' })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

charityRouter.post('/uploadPhoto', (req, res) => {    
    const busboy = new BusBoy({ headers: req.headers })
    let imageFileName
    let imageToBeUploaded = {}

    busboy.on('file',  (_, file, filename, _, mimetype) => {
        if (mimetype !== 'image/png' && mimetype !== 'image/jpeg' && mimetype !== 'image/jpg') 
            return res.status(400).json({ error: 'Unsupported file format' })
        
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

            return res.json({ message: 'Image uploaded successfully', photoURL })
        }
        catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Something went wrong' })
        }
    })
    
    req.pipe(busboy)
})

module.exports = charityRouter
