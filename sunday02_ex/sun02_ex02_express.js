//sun02_ex02_express.js
var http = require('http');
var express = require('express');
var app = express();
var static = require('serve-static');
var router = express.Router();
// Tip : 미들웨어 설정을 하고 서버를 설정해라
app.set('port', 3000);

//static public 미들웨어를 사용하면 된다.
//npm install serve-static --save

app.use('/public', static(__dirname + '/public'));

//app.get('/', function(req, res){
router.route('/').get(function(req, res){
    res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
    res.write('<h1>수채화 감삼</h1>')
    res.write('<img src="public/images/img01.jpg" />')
    res.end();
});

app.use('/', router);

//http.createServer(app).listen(3000, function(){
http.createServer(app).listen(app.get('port'), function(){
    //console.log('localhost:%d', 3000);
    console.log('localhost:%d', app.get('port'));
});


