const PORT = process.env.PORT || 8080

const express = require('express')
const app = express()

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.get('/', (req, res) => {
    res.send('Mmyallo!')
})