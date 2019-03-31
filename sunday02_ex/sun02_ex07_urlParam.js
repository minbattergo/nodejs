//sun02_ex07_

const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();
const static = require('serve-static');
const path = require('path');
const bodyParser = require('body-parser');
const util = require('util');

//app.set('port', process.env.PORT || 3000);
app.set('port', process.env.PORT || 80);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', static(path.join(__dirname, 'public')) );

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

router.route('/process/login').post((req, res)=> {
    console.log("process/login 요청");
    
    let paramId = req.body.id || req.query.id;
    let paramPass = req.body.password || req.query.password;
    let user = {
        id : paramId,
        password : paramPass
    };
    res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
    res.end(util.format('login 처리 페이지 : %j', user));
})

//url 파라메터 처리
function paramMethod(req, res) {
    let oper = req.params.op;
    let val1 = req.params.a;
    let val2 = req.params.b;
    let result = 0;
    
    if(oper == 'plus') {
        result = parseInt(val1) + parseInt(val2);
    } else if(oper = 'minus') {
        result = parseInt(val1) - parseInt(val2);
    }
    
    res.end("" + result);
}

router.route('/calc/:op/:a/:b').get((req, res)=>{
    paramMethod(req, res);
 });  

router.route('/calc/:op/:a/:b').post((req, res)=>{
    paramMethod(req, res);
});

router.route('/').get((req, res)=>{
    console.log('/ 페이지로 요청');
    
    //res.end('/ page')
    //res.end('http://www.naver.com');
    res.redirect('/index.html')
});

router.route('/home').get((req, res) => {
    console.log('/home 페이지 요청') ;
    
    //res.end('home page');
    req.app.render('home', {}, function(err, html){
        if(err) throw err;
        res.end(html);
    });
});

app.use('/', router);
const server = http.createServer(app)
server.listen(app.get('port'), ()=>{
   console.log('localhost:%d', app.get('port'));
    
});