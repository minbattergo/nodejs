var io = require('socket.io')(3000);


io.sockets.on('connection', function(sock){
    sock.emit('news', {hello:'Wrold'});
    sock.on('my other event', function(data){
        console.log(data);
    });
});