var socketio = require('socket.io');
var http = require('http');

var express = require('express');
var static = require('serve-static');
var path = require('path');
var app = express();


var server = http.createServer(app)
server.listen(3000, function(){
    console.log('http://localhost:3000 ... Start !!!')
});


var io = socketio.listen(server);

io.sockets.on('connection', function(socket){
    console.log('server connection ... !!!') ;
    //client 이벤트 전송
    socket.emit('news', {hello:'world'});
    //client 이벤트 받기
    socket.on('my other event', function(data){
        console.log(data);
    })
});