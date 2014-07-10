var express          = require('express');
var http             = require('http');
var app              = express();
var server           = http.Server(app);
var io               = require('socket.io')(server);
var WebSocketServer  = require('websocket').server;

app.use(express.static(__dirname + '/www/'));
server.listen(8080);

console.log('web server listening on port 8080...');

//
// Socket.io message bus
//

// specify all events that should be relayed here
var events = [
  'state:change:1',
  'state:change:2',
  'state:change:3',
  'state:change:4',
  'state:change:5',
  'state:change:6',
  'state:change:7',
  'state:change:8',
  'state:change:9',
  'state:change:10',
  'state:change:11'
];

io.on('connection', function (socket) {
  console.log('new socket.io connection...');
  events.forEach(function(event){
    socket.on(event, function (data) {
      console.log('socket.io recieved', event);
      socket.broadcast.emit(event);
    });  
  });
});


//
// Vanilla WebSocket Server
//
var server = http.createServer();

server.listen(8081, function() {
    console.log((new Date()) + ' SocketServer is listening on port 8081');
});

var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {

    var connection = request.accept();

    console.log((new Date()) + ' new websocket connection');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received WebSocket Message: ' + message.utf8Data);
            io.sockets.emit(message.utf8Data);
        }
        else if (message.type === 'binary') {
          // We don't support this
          console.log('Received WebSocket Binary Message of ' + message.binaryData.length + ' bytes');
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

