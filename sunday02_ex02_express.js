// sunday02_ex02_express.js
var http = require('http');
var express = require('express');
var app = express();
var router = express.Router();
//npm install serve-static --save
var static = require('serve-static');

app.set('port', 3000);

app.use('/public', static(__dirname + '/public'));

//app.get('/show', function(req, res) {
router.route('/show').get(function(req, res) {
    res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
    res.write('<h1>수채화 감상</h1>');
    res.wirte('<img src="/public/images/img_yun02.jpg" />');
    res.end(); 
});

app.use('/', router);

http.createServer(app).listen(app.get('port'), function() {
    console.log('localhost:%d', app.get('port'));
});