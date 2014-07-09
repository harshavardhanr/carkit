$(function() {
  // var socket = io.connect('http://' + window.location.host + ':8080');

  var socket = io.connect('http://' + window.location.host);


  $('#play-video').on('click', function(){
    socket.emit('video:play');
  });

  $('#switch-image').on('click', function(){
    socket.emit('image:switch');
  });
}); 