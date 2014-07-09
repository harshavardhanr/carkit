var express          = require('express');
var http             = require('http');
var app              = express();
var server           = http.Server(app);
var io               = require('socket.io')(server);
var WebSocketServer  = require('websocket').server;

app.use(express.static(__dirname + '/www/'));
server.listen(8080);

console.log('web server listening on port 8080...');

var events = [
  'video:play',
  'image:switch'
];

io.on('connection', function (socket) {
  console.log('new socket connection...');
  events.forEach(function(event){
    console.log('listening for', event);
    socket.on(event, function (data) {
      console.log('Received event', event);
      socket.broadcast.emit(event);
    });  
  });
});



// Websocket shit

var server = http.createServer(function(request, response) {
    response.writeHead(404);
    response.end();
});

server.listen(8081, function() {
    console.log((new Date()) + ' SocketServer is listening on port 8081');
});

var wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});



wsServer.on('request', function(request) {

    var connection = request.accept();

    console.log((new Date()) + ' new connection');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

