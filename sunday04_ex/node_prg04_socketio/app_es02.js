const http = require('http');
const express = require('express');
const app = express();
const socketio = require('socket.io');

const server = http.createServer(app);

server.listen(3000, function(){
    console.log('서버사 실행 되었습니다.');
});

var io= socketio.listen(server);

io.sockets.on('connection', function(socket){
    console.log('server connection ... !!!')
    
    io.sockets.emit('this', {will:'be received by everyone'});
    
    socket.on('private message', function(from, msg) {
        console.log('private message by ', from, 'saying ', msg);
    });
    
    socket.on('disconnect', function(){
        console.log('socket disconnect .... !!!');
        io.sockets.emit('user disconnected');
    });
})