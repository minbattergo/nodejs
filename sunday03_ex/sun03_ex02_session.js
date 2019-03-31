//sun03_ex02_session.js

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();
const static = require('serve-static');

app.set('port', process.env.PORT || 3000);

// view engine을 ejs로 설정 한다.
app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");

app.use('/public', static(__dirname + "/public"));

app.use(cookieParser());
app.use(expressSession({
        secret:'my key',
        resave: true,
        saveUninitalized: true
}));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

router.route('/process/login').post((req, res)=> {
    console.log('/porcess/login');
    //post 방식에선 body-parser 사용
    let paramId = req.body.id || req.query.id;
    let paramPwd = req.body.pwd || req.query.pwd;
    
    let loginData = {
        id : paramId,
        password: paramPwd
    }
    
    if(req.session.user) {
        console.log('이미 로그인 되어 있습니다. product 페이지로 redirect')
        res.redirect('/public/product.html')
    } else {
        console.log('session에 로그인 설정');
        req.session.user = {
            id: paramId,
            name: '민보다',
            authorized: true
        };
    }
    
    //ejs 엔진이 있어야 됨
    req.app.render('login_result', {'data':req.session.user}, (err, html)=>{
        if(err) throw err;
        
        res.end(html);
    });
    //res.send(loginData);
});

router.route('/process/logout').get((req, res)=>{
    console.log('process/logout 요청됨 !!');
    //로그인 정보를 destory()처리한다.
    if(req.session.user) {
        req.session.destroy((err) => {
           if(err) throw err;
            
            console.log("세션을 삭제하고 로그아웃 됨.");
        });
    } else {
        console.log('아직 로그인 전입니다.');
    }
    res.redirect('/public/login.html');
})

app.use('/', router); //=> 서버실행하기전 router 미들웨어
const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
   console.log('http://locahost:%d', app.get('port'));
});

