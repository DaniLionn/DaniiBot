const express = require('express')
const app = express()
var pingport = 80

app.use(express.json())
console.log("keep_alive running (i think)")
app.get("/test", function (Request, Res) {
  console.log("pinged")
  res.send('ok');
});

app.listen(pingport)