//app03.js
var http = require('http');
var express = require('express');
var app = express();
var cors = require('cors')
var socketio = require('socket.io');
var static = require('serve-static');
var path = require('path');

app.use(cors());

// public 디렉토리를 static 으로 설정
app.use("/public", static(path.join(__dirname, "public")));


app.get("/", function(req, resp) {
    resp.end('Hello Node JS Chatting program ...');
});

var server = http.createServer(app).listen(3000, function() {
   console.log('server started ...'); 
});

// 로그인 아이디 매핑(로그인 id로 소켓 id를 찾는다)
// {로그인id:소켓id, 로그인id:소켓id ...}
var login_ids = {};

// 응답 메세지 전송 메소드
function sendResponse(socket, command, code, message) {
    var statusObj = {command: command, code:code, message:message};
    socket.emit('response', statusObj);
}

var io = socketio.listen(server);
io.sockets.on("connection", function(socket) {
    console.log('서버의 웹속켓 접속 정보: ', socket.request.connection._peername);
    
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;
    
    socket.on('message', function(message) {
        console.log('message 이벤트를 받았습니다.');
        console.dir(message);
        
        if(message.recepient=='All') {
            console.log('모든 클라이언트에게 메세지 전송...');
            io.sockets.emit('message', message); 
        } else {
            // 일대일 채팅 대상에게 메세지 전달
            if(login_ids[message.recepient]) {
                var socket_id = login_ids[message.recepient];
                io.sockets.connected[socket_id].emit('message', message);
                
                // 응답 메세지 전송
                sendResponse(socket, 'message', '200','메세지를 전송했습니다.');
            } else {
                sendResponse(socket, 'login', '404','상대방의 로그인 id가 존재 하지 않습니다.');
            }
        }
    });
    
    socket.on('login', function(login) {
        console.log('login 이벤트를 받았습니다.');
        console.dir(login);
        
        // 기존 클라이언트 id가 없다면 클라이언트 id를 맵에 추가한다.
        console.log('접속한 소켓의 id: ' + socket.id);
        login_ids[login.id] = socket.id;
        socket.login_id = login.id;
        
        console.log('접속한 클라이언트 id 개수: %d', Object.keys(login_ids).length);
        
        // 응답 메시지 전송
        sendResponse(socket, 'login','200','로그인 되었습니다.');
    });
});