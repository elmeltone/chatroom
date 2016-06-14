$(function() {
    var socket = io({
        'reconnection': false
    });
    var $login = $('.login');
    var $base = $('.base');
    var $begin = $('.begin');
    var $count = $('.count');
    var $username = $('.username');
    var $input = $('.chatter');
    var $messages = $('.messages');
    var nickname;
    var count = 0;

    var addNickname = function(name) {
        $messages.append('<div>'+name+'</div>');
    };

    var addCount = function(users) {
        $count.empty();
        $count.append(users);
    };

    var addMessage = function(message) {
        $messages.append('<div>'+message+'</div>');
    };

    $username.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }

        nickname = $username.val();
        console.log(nickname);
        $('.welcome').append(nickname);
        socket.emit('nickname', nickname);
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
            return;
        }

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

        var message = $input.val();
        socket.emit('message', nickname+': '+message);
        $input.val('');
        $messages.scrollTop = $messages.scrollHeight;
    });

    socket.on('nickname', addNickname);
    socket.on('count', addCount);
    socket.on('message', addMessage);
});
