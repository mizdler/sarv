// var http = require('http');
//
// var app = http.createServer(function(req,res){
//   random = Math.floor(Math.random() * 400)
//   console.log(random);
//   res.setHeader('Content-Type', 'application/json');
//   res.end(JSON.stringify({ value: random }));
// });
// app.listen(3000);


var port = 3000;
var http = require("http");
var server = http.createServer();
server.on('request', request);
server.listen(port);
function request(request, response) {
    var random = Math.floor(Math.random() * 400)
    console.log(random);
    var store = ""
    request.on('data', function(data) 
    {
      console.log(data)
      store += data;
    });
    request.on('end', function() 
    {  console.log(store);
        response.setHeader("Content-Type", "text/json");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.end(JSON.stringify({ value: random }));
    });
}  
