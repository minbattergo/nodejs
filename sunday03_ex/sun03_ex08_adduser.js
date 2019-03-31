//sun03_ex02_session.js

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();
const static = require('serve-static');
const MongoClient = require('mongodb').MongoClient;

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

//MongoClient 접속 설정
let db = null;
function connectDB(){
    let dbUrl = 'mongodb://localhost';
    MongoClient.connect(dbUrl, function(err, conn) {
        if(err) throw err;
        db = conn.db('local');
        console.log('DB Connection Success !!! : ' + dbUrl);
        
    });
} //end of cpmmectDB

// 함수 선언 ===================================================
//DataBase 처리부분만 분리시킴
function authUser(database, loginData, callback) {
    var users = database.collection('users');
    
    users.findOne(loginData, function(err, doc){
        if(err) {
           callback(err, null);
           return
        }
        
        callback(null, doc);
    });
}

function addUser(database, userData, callback) {
    var users = database.collection('users');
    
    users.insertMany([userData], function(err, result){
        if(err) {
            callback(err, null);
            return;
        }
        
        if(result.insertedCount > 0){
            console.log('사용자 레코드 추가 됨 : ', result.insertedCount);
        } else {
            console.log("추가된 카운트 없음");
        }
        callback(null, result);
    });
}


//route Path 설정 부분==========================================
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
        if(db) {
            authUser(db, loginData, function(err, doc){
                if(err) throw err;
                
                //db에 로그인 정보와 일치 한다면 실행되는 부분(callback함수 내용이 된다.)
                console.log('session에 로그인 설정');
                req.session.user = {
                    id: paramId,
                    name: doc.name,
                    authorized: true
                };

                //ejs 엔진이 있어야 됨
                req.app.render('login_result', {'data':req.session.user}, (err, html)=>{
                    if(err) throw err;

                    res.end(html);
                });
            });
        }//end if(db)
    }//end if
    
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
});


router.route('/process/adduser').post((req, res)=> {
    console.log('adduser 요청 됨 !!!!!');
    
    var paramId = req.body.id || req.query.id;
    var paramPwd = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    
    let userData = {
        id: paramId,
        password: paramPwd,
        name: paramName
    }
    
    //console.log("user data : ", userData);
    //res.send(userData);
    
    if(db) {
        addUser(db, userData, function(err, result){
            if(err) throw err;
            
            if(result && result.insertedCount > 0) {
                console.log(result);
                res.end('success');
            } else {
                res.end('fail');
            }
        })
    } else {
        res.end('db connect error !!!');
    }
    
});

app.use('/', router); //=> 서버실행하기전 router 미들웨어
const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log('http://locahost:%d', app.get('port'));
    
    connectDB();
});

