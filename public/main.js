$(function() {
    var socket = io({
        'reconnection': false
    });
    var $login = $('.login');
    var $base = $('.base');
    var $begin = $('.begin');
    var $count = $('.count');
    var $username = $('.username');
    var $present = $('.present');
    var $input = $('.chatter');
    var $messages = $('.messages');
    var nickname;
    var count = 0;

    var addNickname = function(name) {
        $messages.append('<div class="door-box">'+name+'</div>');
    };
    var clearNames = function() {
        $present.empty();
    };
    var showNames = function(names) {
        $present.append(names);
    };
    var addCount = function(users) {
        $count.empty();
        $count.append(users);
    };
    var isTyping = function(typer) {
        $('.'+typer).empty();
        $('.'+typer).append(' is typing...');
        function timeTyping() {
        $('.'+typer).empty();
        };
        clearTimeout(timeTyping);
        setTimeout(timeTyping, 2500);
    };
    var addMessage = function(message) {
        $messages.append('<div class="message-box">'+message+'</div>');
        $messages[0].scrollTop = $messages[0].scrollHeight;
    };
    var selfMessage = function(message) {
        $messages.append('<div class="own-message">'+message+'</div>');
        $messages[0].scrollTop = $messages[0].scrollHeight;
    };

    $username.focus();

    $username.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }

        nickname = $username.val();
        console.log(nickname);
        $('.welcome').append(nickname);
        socket.emit('nickname', nickname);
        socket.emit('clearNames');
        socket.emit('showName', nickname);
        count = count+1;
        socket.emit('count', count);
        $login.fadeOut(200, function() {
            $base.fadeIn(200, function() {
                $input.focus();
            });
        });
        $username.val('');
    });

    $input.on('keydown', function(event) {
        if (event.keyCode != 13) {
            socket.emit('typing');
            return;
        } else if (event.keyCode === 13) {
            if($begin.css('opacity') != '0') {
                $begin.css({
                    'opacity': '0',
                    'transition': '0.2s'
                });
                $begin.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
                    $begin.css({
                        'font-size': '1px',
                        'transition': '0.2s'
                    });
                });
            };
        };

        var message = $input.val();
        socket.emit('message', nickname+': '+'<span class="content">'+message+'</span');
        socket.emit('selfMessage', nickname+': '+'<span class="content">'+message+'</span');
        $input.val('');
    });

    socket.on('nickname', addNickname);
    socket.on('clearNames', clearNames);
    socket.on('showName', showNames);
    socket.on('count', addCount);
    socket.on('typing', isTyping);
    socket.on('message', addMessage);
    socket.on('selfMessage', selfMessage);
});
