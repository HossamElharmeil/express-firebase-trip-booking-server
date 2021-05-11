const PORT = process.env.PORT || 8080

const express = require('express')

const admin = require('firebase-admin')
admin.initializeApp()
const firebase = require('firebase')
firebase.initializeApp({
    apiKey: "AIzaSyCxzqaOCg6HNjeMVcjO8aJq3pwb6ZkiWmw",
    authDomain: "sahm-b2b16.firebaseapp.com",
    projectId: "sahm-b2b16",
    storageBucket: "sahm-b2b16.appspot.com",
    messagingSenderId: "888002118145",
    appId: "1:888002118145:web:c8b98a026a40b0daad3600",
    measurementId: "G-54QZXQ8HLN"
})


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