const express = require('express')
const app = express()
var port = 80

app.use(express.json())
console.log("keep_alive running (i think)")

app.get("/test", function (Request, Res) {
  console.log("TEST OK")
  Res.send('ok');
});

app.listen(port)