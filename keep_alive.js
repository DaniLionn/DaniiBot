var http = require('http');
console.log("keep_alive running (i think)")
http.createServer(function (req, res) {

  res.write("I'm alive");
  console.log("pinged!!")
  res.end();

}).listen(80);