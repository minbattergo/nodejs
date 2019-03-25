var http = require('http');
var express = require('express');
var static = require('serve-static');

var app = express();
var router = express.Router();

// npm install ejs --save
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// static 미들웨어 설정
app.use('/public', static(__dirname + '/public'));

router.route('/user/login').get(function(req, res) {
    console.log('/user/login 요청 됨');
    
    // get 방식에서 요청파라미터 받기 확인 : req.query 객체에서 사용.
    var userId = req.query.id;
    var userPass = req.query.password;
    var user = {
        id : userId,
        pass : userPass
    };
    
    //console.log(userId, userPass);
    //res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
    //res.end(`id:${userId}, pass:${userPass}`);
    
    req.app.render('login_ok', {"user": user}, function(err, html) {
        if(err) {
            throw err;
        }
        
        res.end(html);
    });
});

app.use('/', router);

var server = http.createServer(app);
server.listen(3000, function() {
    console.log('localhost:3000');
});