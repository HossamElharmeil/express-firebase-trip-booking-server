const Router = require('express').Router
const db = require('firebase-admin').firestore()

const variablesRouter = Router()

variablesRouter.post('/setVariables', async (_, res) => {
    let variables = {}

    if (req.body.points) variables.points = req.body.points
    if (req.body.pricePerKilo) variables.pricePerKilo = req.body.pricePerKilo
    if (req.body.minimumPoints) variables.minimumPoints = req.body.minimumPoints

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
