var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var users = 0;

io.on('connection', function (socket) {
  console.log('Client '+socket.id+' connected.');
  ++users;
  socket.on('nickname', function(nickname) {
    io.emit('nickname', nickname + ' entered the chat.');
  });
  /*io.emit('count', users);
  socket.broadcast.emit('message', socket.id+' has entered the chat.');*/
  io.emit('message', 'There are '+users+' users in the chat.');

  socket.on('message', function(message) {
     console.log('Received message:', socket.id+': '+message);
     io.emit('message', socket.id+': '+message);
  });
});

/*io.on('disconnection', function(socket) {
  console.log('Client '+socket.id+' disconnected.')
  users = users-1;
  io.emit('message', 'There are '+users+' users in the chat.');
});*/

server.listen(8080);
