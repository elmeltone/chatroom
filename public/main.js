$(function() {
    var socket = io();
    var $login = $('.login');
    var $base = $('.base');
    var $username = $('.username');
    var $input = $('.chatter');
    var $messages = $('.messages');

    var addMessage = function(message) {
        $messages.append('<div>' + message + '</div>');
    };

    $username.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }

        var nickname = $username.val();
        socket.id = nickname;
        console.log('Name changed to '+nickname);
        $login.fadeOut(200, function() {
            $base.show(200);
        });
        $username.val('');
    });

    $input.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }

        var message = $input.val();
        addMessage(message);
        socket.emit('message', message);
        $input.val('');
    });

    socket.on('message', addMessage);
});
