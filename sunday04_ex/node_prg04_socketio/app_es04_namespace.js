var http = require('http');
var express =require('express');
var app = express();

var socketio =  require('socket.io')

var server = http.createServer(app);
server.listen(3000, function(){
    console.log('http://localhost:3000 Start ...');
});

var io = socketio.listen(server);

//네임스페이스(이름공간) 설정
var chat = io.of('/chat').on('connection', function(socket) {
    console.log('chat connection event ...');
    
    //chat 변수와 socket변수로 데이터 확인 테스트
    socket.emit('socket message', {
        that: 'only',
        '/chat':'will get'
    });
    
    chat.emit('chat message', {
        everyone: 'in',
        '/chat':'will get'
    });
    
    chat.on('hi', function(msg){
        console.log('chat hi >>>', msg);
    });
    
    socket.on('hi', function(msg){
        console.log('socket hi >>>', msg);
    });
    
});


var news = io.of('/news').on('connection', function(socket){
    news.on('hi', function(msg){
        console.log('news hi >>>', msg);
    });
    
    socket.on('hi', function(msg){
        console.log('socket news hi >>>', msg);
    });
});


/*
io.sockets.on('hi', function(msg){
    console.log('sockets hi', msg);
});
*/







