//sun02_ex02_static.js

var http = require('http');
var express  = require('express');
var static  = require('serve-static');

app = express();

var router = express.Router();

//static 미들웨어 설정
app.use('/public', static(__dirname + '/public'));

router.route('/show').get(function(req, res){
   console.log('/show 요청됨'); 
   
    res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
    res.write('<img src="/public/images/img02.jpg" />');
    res.end();
});
app.use('/', router); //서버 실행하기전 지정 

var server = http.createServer(app);
server.listen(3000, function(){
    console.log('localhost:3000');
    
});

