const Router = require('express').Router
const db = require('firebase-admin').firestore()

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

module.exports = variablesRouter
