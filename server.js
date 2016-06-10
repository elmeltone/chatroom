var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var users = [];

io.on('connection', function (socket) {
    console.log('Client '+socket.id+' connected');
    users.push(socket.id);
    io.emit('message', 'User '+socket.id+' has entered the chat.');
    io.emit('message', 'There are '+users.length+' users in the chat.');

    socket.on('message', function(message) {
        console.log('Received message:', socket.id+': '+message);
        socket.broadcast.emit('message', socket.id+': '+message);
    });
});

server.listen(8080);
