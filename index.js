const PORT = process.env.PORT || 8080

const express = require('express')
const app = express()

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.get('/', (req, res) => {
    res.send('Mmyallo!')
})

app.post('/auth/enterPhone', (req, res) => {
    res.json({success: 'Code sent'})
})

app.post('/auth/enterCode', (req, res) => {
    res.json({success: 'Logged in', token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImNjM2Y0ZThiMmYxZDAyZjBlYTRiMWJkZGU1NWFkZDhiMDhiYzUzODYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc29jaWFsLW1lZGlhLWQxYTgzIiwiYXVkIjoic29jaWFsLW1lZGlhLWQxYTgzIiwiYXV0aF90aW1lIjoxNjIwNTY0MTk3LCJ1c2VyX2lkIjoiUWE5RU5NYW9pSGdBN01Md0plczY2dEFMZnVlMiIsInN1YiI6IlFhOUVOTWFvaUhnQTdNTHdKZXM2NnRBTGZ1ZTIiLCJpYXQiOjE2MjA1NjQxOTcsImV4cCI6MTYyMDU2Nzc5NywiZW1haWwiOiJob3NzYW0uZWxoYXJtaWxAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImhvc3NhbS5lbGhhcm1pbEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.ZNq6H-AOnPDi4Jxqi_DqfgwCRXS31mX4kFDVTWWEGoFiUpibGLbmrMWVBIP-8f0CuxUQ0jxKsWwRaHhhtDVULWZPyvNAsoujKmBmEBTdKCb8M9ZQ3O-RMbee34swWeAcmvkJFlfoqWCakp42t-gL4VEH5muofHnHg4LLQ5XMK14znBWkBCppvSpBW359iEOTn27Ownzfn8TcgIE_bzmBZ_hE5qw8W87vm2oKXXXqGmJmvNBZFzYSiYvGdVQlGiY6g_joIexfNfEEHzKJOEKUSZkDRBcltWH0RugQ0oQQfkg-5AhfOyVuvxxR-MBuM-VMzr-vPGv4ZKIIJftdUVoO4A'})
})