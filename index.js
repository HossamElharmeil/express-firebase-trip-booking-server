const PORT = process.env.PORT || 8080

const express = require('express')
const config = require('./util/config').firebaseConfig

const admin = require('firebase-admin')
admin.initializeApp()
const firebase = require('firebase')
firebase.initializeApp(config)


const app = express()
app.use(express.json())
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

const routes = require('./routes')
app.use(routes)

app.get('/', (req, res) => {
    res.send('Mmyallo!')
})