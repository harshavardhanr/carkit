var express  = require('express');
var app      = express();
var server   = require('http').Server(app);
var io       = require('socket.io')(server);

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