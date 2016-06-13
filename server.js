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
    socket.nickname = nickname;
    io.emit('nickname', nickname + ' entered the chat.');
  });
  socket.on('count', function(count) {
    io.emit('count', users);
  });
  socket.on('message', function(message) {
     console.log('Received message:', socket.id+': '+message);
     io.emit('message', message);
  });
  socket.on('disconnect', function() {
    console.log('Client '+socket.id+' disconnected.');
    --users;
    io.emit('count', users);
    io.emit('nickname', socket.nickname + ' left the chat.');
  });
});


server.listen(8080);
