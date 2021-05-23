const PORT = process.env.PORT || 8080

require('firebase-admin').initializeApp()
const busboy = require('connect-busboy')
const config = require('./util/config').firebaseConfig
const express = require('express')
require('firebase').initializeApp(config)
const routes = require('./routes')

const app = express()

app.use(express.json())
app.use(busboy())

app.use(routes)
app.get('/', (req, res) => {
    res.send('Mmyallo!')
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))