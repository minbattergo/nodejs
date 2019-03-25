// sunday02_ex01_http.js
var http = require('http');
var fs = require('fs');
// npm install express --save
var express = require('express');
var app = express();

//var server = http.createServer(app);  <-- express 함께 사용 형태
var server = http.createServer();
server.listen(3000, function() {
    console.log('서버실행중 ...');
});

server.on('connection', function(socket) {
    //console.log(socket);
    console.log('connection 이벤트 발생');
});

// server.on('request)는 express와 함께 사용하지 않는다.
server.on('request', function(request, response) {
    console.log('request 이벤트 발생.');
//    response.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
//    response.write('<h1>request 요청 됨</h1>');
//    response.end();
    //
    fs.readFile('public/images/img_yun01.jpg', function(err, data) {
        response.end(data);
    });
});

server.on('close', function() {
    console.log('close 이벤트 발생.');
});