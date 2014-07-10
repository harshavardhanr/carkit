$(function() {
  var socket = io.connect('http://' + window.location.host);

  $('button').on('click', function(){
    var state = $('select').val(); 
    console.log('changing state to ', state);
    socket.emit('state:change:' + state);
  });
}); 