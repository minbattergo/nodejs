var http = require('http');
var fs = require('fs');
//npm install express --save
var express = require('express');
var app = express();

//var server = http.createServer(app); // express를 동시에 쓰는 경우 서버작동이 안됨
var server = http.createServer();
server.listen(3000, function() {
    console.log('서버실행중 ...')
});


server.on('connection', function(socket){
    //console.log(socket);
    console.log('connection 요청 됨')
});

//server.on('request')는 express와 함께 사용 하지 않는다.
server.on('request', function(req, res){
    console.log('request 요청이 들어왔습니다.');
    
/*  
    res.writeHead(200,{"Content-type":"text/html;charset=utf-8"});
    res.write('<h1>request 요청 됨!!!!</h1>');
    res.end();
*/
    var filename = 'public/images/img02.jpg';
    fs.readFile(filename, function(err, data){
       res.writeHead(200, {"Content-Type":"image/png"});
       res.write(data);
       res.end();
        
    }); 
});

server.on('close', function(){
    console.log('close 이벤트 발생 !!!!');
});