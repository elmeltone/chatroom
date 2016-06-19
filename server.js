var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var users = 0;
var usersArray = [];

io.on('connection', function (socket) {
  console.log('Client '+socket.id+' connected.');
  var usersPresent = false;
  ++users;
  socket.on('nickname', function(nickname, showName) {
    usersPresent = true;
    socket.nickname = nickname;
    socket.broadcast.emit('nickname', nickname+' entered.');
    usersArray.push(nickname);
    io.emit('clearNames');
    for (i=0; i<usersArray.length; i++) {
      io.emit('showName', '<div class="name-box">'+usersArray[i]+'<span class="'+
        usersArray[i]+' typing"></span></div>');
    };
  });
  socket.on('count', function() {
    io.emit('count', users);
  });
  socket.on('typing', function(typer) {
    typer = socket.nickname;
    socket.broadcast.emit('typing', typer);
  });
  socket.on('stop typing', function(typer) {
    typer = socket.nickname;
    socket.broadcast.emit('stop typing', typer);
  });
  socket.on('message', function(message) {
     console.log('Received message:', socket.id+': '+message);
     socket.broadcast.emit('message', message);
  });
  socket.on('message', function(message) {
     socket.emit('selfMessage', message);
  });
  socket.on('disconnect', function() {
    if (usersPresent) {
      var index = usersArray.indexOf(socket.nickname);
      if (index > -1) {
        usersArray.splice(index, 1);
      };
      --users;
      console.log('Client '+socket.id+' disconnected.');
      socket.broadcast.emit('count', users);
      socket.broadcast.emit('nickname', socket.nickname+' left.');
      socket.broadcast.emit('clearNames');
      for (i=0; i<usersArray.length; i++) {
        socket.broadcast.emit('showName', '<div class="name-box">'+usersArray[i]+'</div>')
      };
    };
  });
});


server.listen(8080);

exports.app = app;
//exports.storage = storage;
