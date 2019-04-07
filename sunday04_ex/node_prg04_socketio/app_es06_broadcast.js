var io = require('socket.io').listen(3000);

io.sockets.on('connection', function(socket){
    //브로드 캐스트 - 전체로 보낸다.
    
    // 자기자신을 제외한 나머지 연결된 소켓들에게 보낸다.
    socket.broadcast.emit('user connected');
});
