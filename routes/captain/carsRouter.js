const Router = require('express').Router
const verifyToken = require('../../middleware/verifyToken')
const db = require('firebase-admin').firestore()

const carsRouter = Router()

carsRouter.get('/getCars', verifyToken, async (req, res) => {
    const uid = req.user.uid
    try {
        const carsQuery = await db.collection('cars').where('captainId', '==', uid).get()
        const cars = carsQuery.docs.map(car => car.data())

        res.json(cars)
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
})

carsRouter.post('/addCar', verifyToken, async (req, res) => {
    const uid = req.user.uid

    const newCar = {
        color: req.body.color,
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        captainId: uid
    }
    try {
        const newCarDocument = await db.collection('cars').add(newCar)
        const newCarId = newCarDocument.id

        const captain = (await db.collection('captains').doc(uid).get()).data()
        const cars = captain.cars || []
        cars.concat([newCarId])

        await db.collection('captains').doc(uid).set({ cars })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = carsRouter