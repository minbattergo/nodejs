var http=require('http');
var express=require('express');
var app = express()
var socketio=require('socket.io');
var cors=require('cors');
var static = require('serve-static');
var path = require('path');

app.use( cors() );

app.use('/public', static(path.join(__dirname, 'public')));


var server = http.createServer(app).listen(3000, function() {
    console.log('서버가 시작되었습니다. 포트: ' + 3000);
    
});

var io = socketio.listen(server);

io.sockets.on('connection', function(socket){
    console.log('connection info: ', socket.request.connection._peername);
    
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;
    
    
    //'message' 이벤트를 받았을 때의 처리
    socket.on('message', function(message) {
        console.log('message 이벤트를 받았습니다.');
        console.dir(message);
        
        if(message.recepient == 'All') { 
            // 현재 접속자를 포함한 모든 클라이언트에 메세지 전달
            console.dir('현재 접속 세션을 포함한 모든 클라이언트에게 메세지 전달');
            io.sockets.emit('message', message);
        }
    });
});


