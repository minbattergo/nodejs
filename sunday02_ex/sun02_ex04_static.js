//sun02_ex02_static.js

var http = require('http');
var express  = require('express');
var static  = require('serve-static');

app = express();

var router = express.Router();

//npm install ejs --save
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//static 미들웨어 설정
app.use('/public', static(__dirname + '/public'));

router.route('/user/login').get(function(req, res){
   console.log('/user/login'); 
   
    var userId   = req.query.id;
    var userPass = req.query.password;
    var user = {
        id : userId,
        pass : userPass
    };

/*
    console.log(userId, userPass);
    res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
    //res.write('<img src="/public/images/img02.jpg" />');
    res.end(`id:${userId}, pass:${userPass}`);
*/
    //user 라는 이름으로 user 객체를 login_ok.ejs에 넘기고 결과를 callback 함수로 받음
    req.app.render('login_ok', {"user" : user}, function(err, html){
        if(err) throw err;
        
        res.end(html);
    }); //=> 랜더링시 객체 넣어준다.
});
app.use('/', router); //서버 실행하기전 지정 

var server = http.createServer(app);
server.listen(3000, function(){
    console.log('localhost:3000');
    
});

