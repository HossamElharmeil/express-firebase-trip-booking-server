const Router = require('express').Router
const db = require('firebase-admin').firestore()
const { uploadImage } = require('../../services/index')

const variablesRouter = Router()

variablesRouter.post('/setVariables', async (req, res) => {
    let variables = {}

    if (req.body.points) variables.points = req.body.points
    if (req.body.minimumPoints) variables.minimumPoints = req.body.minimumPoints
    if (req.body.pricePerKilo) variables.pricePerKilo = req.body.pricePerKilo
    if (req.body.pricePerHour) variables.pricePerHour = req.body.pricePerHour
    if (req.body.commission) variables.commission = req.body.commission

    try {
        await db.collection('variables').doc('variables').update(variables)
        return res.json({ success: 'Variables updated successfully' })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

variablesRouter.get('/getPackages', async (_, res) => {
    try {
        const packagesQuery = await db.collection('packages').get()
        const packages = packagesQuery.docs.map(doc => {
            const data = doc.data()
            data.id = doc.id
            return data
        })

        return res.json(packages)
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

variablesRouter.get('/getPackage/:id', async (req, res) => {
    const packageId = req.params.id

    try {
        const package = (await db.collection('packages').doc(packageId).get()).data()

        return res.json(package)
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

variablesRouter.post('/addPackage', async (req, res) => {
    const newPackage = {
        name: req.body.name,
        kilometers: req.body.kilometers,
        tripCount: req.body.tripCount,
        price: req.body.price,
        active: true
    }

    try {
        await db.collection('packages').add(newPackage)

        return res.json({ success: 'Package added successfully' })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

variablesRouter.post('/disablePackage', async (req, res) => {
    const packageId = req.body.packageId

    try {
        await db.collection('packages').doc(packageId).update({ active: false })

        return res.json({ success: 'Package disabled successfully' })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

variablesRouter.get('/getSegments', async (_, res) => {
    try {
        const segmentsQuery = await db.collection('segments').get()
        const segments = segmentsQuery.docs.map(doc => {
            const data = doc.data()
            data.id = doc.id
            return data
        })

        return res.json(segments)
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

variablesRouter.get('/getSegment/:id', async (req, res) => {
    const segmentId = req.params.id

    try {
        const segment = (await db.collection('segments').doc(segmentId).get()).data()

        return res.json(segment)
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

variablesRouter.post('uploadSegmentPhoto', async (req, res) => {
    try {
        const imageURL = await uploadImage(req)

        return res.json({ success: 'Image uploaded successfully', imageURL })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

variablesRouter.post('/addSegment', async (req, res) => {
    const newSegment = {
        name: req.body.name,
        price: req.body.price
    }

    try {
        await db.collection('segments').add(newSegment)

        return res.json({ success: 'Package added successfully' })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = variablesRouter
