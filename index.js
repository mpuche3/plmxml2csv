var http = require('http');
var path = require('path');

var express = require('express');
//var MongoClient = require('mongodb').MongoClient;

//const url = "mongodb://admin:admin@ds121309.mlab.com:21309/spelling-game";
//const mLabDb = "spelling-game";

var router = express();
var server = http.createServer(router);
router.use(express.static(path.resolve(__dirname, 'client')));

// Server Listen
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});


// var socketio = require('socket.io');
// var io = socketio.listen(server);
// //Allow Cross Domain Requests
// io.set("transports", ["websocket"]);