var io = require('socket.io').listen(3000);

io.sockets.on('connection', function(socket){
    socket.on('msg', function(data){
        console.log(data);
        setTimeout(function() {
            // io.sockets.emit() <-- 자기를 포함한 모든 접속자에게 전달됨
            io.sockets.emit('msg_by_server', 'Server got your message: ' + data);
            //socket.emit('msg_by_server', 'Server got your message: ' + data);
        }, 1000);
    }); 
});