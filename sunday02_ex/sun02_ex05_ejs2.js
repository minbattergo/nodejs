//sun02_ex05_ejs.js

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

router.route('/car_list').get(function(req, res){
   console.log('/car_list 요청 됨'); 
   var carlist = [{
    name:'Sonata',
    price:2000,
    company:'현대'
   },
   {
    name:'Sm6',
    price:2800,
    company:'삼성'
   },
   {
    name:'K7',
    price:3300,
    company:'기아'
   }];    
   
    //user 라는 이름으로 user 객체를 login_ok.ejs에 넘기고 결과를 callback 함수로 받음
    req.app.render('car_list', {"carlist" : carlist}, function(err, html){
        if(err) throw err;
        
        res.end(html);
    }); //=> 랜더링시 객체 넣어준다.
});
app.use('/', router); //서버 실행하기전 지정 

var server = http.createServer(app);
server.listen(3000, function(){
    console.log('localhost:3000');
    
});

