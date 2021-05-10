const PORT = process.env.PORT || 8080

const express = require('express')

const admin = require('firebase-admin')
admin.initializeApp()


const app = express()
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

const routes = require('./routes')
app.use(routes)

app.get('/', (req, res) => {
    res.send('Mmyallo!')
})