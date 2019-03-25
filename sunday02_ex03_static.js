var http = require('http');
var express = require('express');
var static = require('serve-static');

var app = express();
var router = express.Router();

// static 미들웨어 설정
app.use('/public', static(__dirname + '/public'));

router.route('/show').get(function(req, res) {
    console.log('/show 요청 됨');
    
    res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
    res.write('<img src="/public/images/img_yun02.jpg"/>');
    res.end();
});

app.use('/', router);

var server = http.createServer(app);
server.listen(3000, function() {
    console.log('localhost:3000');
});