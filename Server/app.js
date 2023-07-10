const express = require('express')
const bodyparser = require('body-parser')

const app = express()
var port = 3000

app.use(bodyparser.text())

app.post('/post', (request, response) => {
    response.send("Gotten POST request")
    console.log(request.body)
})

app.listen(port, function(){
    console.log(`started server at http://localhost:${port}`)
})