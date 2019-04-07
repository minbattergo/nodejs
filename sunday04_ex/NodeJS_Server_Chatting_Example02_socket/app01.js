var http=require('http');
var express=require('express');
var app = express()
var socketio=require('socket.io');
var cors=require('cors');
var static = require('serve-static');
var path = require('path');

var config = require('./config/config')

app.use( cors() );


/////////        서버 변수 설정       ////////
console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 3000);
///////// static으로 public 폴더 설정 ////////
app.use('/public', static(path.join(__dirname, 'public')));


var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('서버가 시작되었습니다. 포트: ' + app.get('port'));
    
});

var io = socketio.listen(server);

io.sockets.on('connecton', function(socket){
    console.log('connection info: ', socket.request.connetion._peername);
    
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;
});


