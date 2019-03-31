//sun03_ex02_session.js

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();
const static = require('serve-static');
//const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

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

var database;
var UserSchema;
var UserModel;

function connectDB() {
    var dbUrl = 'mongodb://localhost:27017/local';
    
    console.log('try connect ..');
    //데이타 베이스 연결
    mongoose.Promise = global.Promise;
    mongoose.connect(dbUrl);
    database = mongoose.connection;
    
    database.on('error', console.error.bind(console, 'connect error.'));
    database.on('open', function(){
        console.log('db connection 성공 !!! : [%s', dbUrl);
        //연결이 성공하면 스키마와 모델 설정을 한다.
        UserSchema = mongoose.Schema({
            id: String,
            name: String,
            password: String
        });
        
        UserSchema.static('findById', function(id, callback){
            return this.find({id:id}, callback);
        });
        
        UserSchema.static('findAll', function(callback){
            return this.find({}, callback);
        });
        
        
        UserModel = mongoose.model('users', UserSchema);
    });//open일때
    
    //연결이 끊어졌을때 5초후 재연결
    database.on('disconnected', function(){
        console.log('연결이 끊어 졌습니다. 5초후 다시 연결합니다.') ;
        setTimeout(connectDB, 5000);
    });
}

// 함수 선언 ===================================================
//DataBase 처리부분만 분리시킴
function authUser(database, loginData, callback) {
    var users = database.collection('users');

    UserModel.find(loginData, function(err, results){
        if(err) {
            callback(err,  null);
            return;
        } 
        console.log(results);
        if(results.length > 0) {
            console.log('일치하는 사용자 찾음.', results[0].id, results[0].password);
            callback(null, results);
        } else {
            console.log('일치하는 사용자 없음');
            callback(null, null);
        }
    });
}

function addUser(database, userData, callback) {
    var users = database.collection('users');
    
    var user = new UserModel(userData);
    user.save(function(err){
        if(err) {
            callback(err, null);
        }
        console.log('사용자 데이터 추가함');
        callback(null, user);
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
        if(database) {
            authUser(database, loginData, function(err, docs){
                if(err) throw err;
                
                //db 에 로그인 정보와 일치 한다면 실행되는 부분(callback함수 내용이 된다.)
                console.log('session에 로그인 설정');
                req.session.user = {
                    id: paramId,
                    name: docs[0].name,
                    authorized: true
                };

                //ejs 엔진이 있어야 됨
                req.app.render('login_result', {'data':req.session.user}, (err2, html)=>{
                    if(err2) throw err2;

                    res.end(html);
                });
            });
        } else {
            console.log('DB connect error.');
        } //end if(db)
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
    
    if(database) {
        addUser(database, userData, function(err, user){
            if(err) throw err;
            
            if(user) {
                console.log(user);
                res.end('success');
            } else {
                res.end('fail');
            }
        });
    } else {
        res.end('db connect error !!!');
    }
    
});

router.route('/process/userlist').get(function(req, res){
    console.log('userlist 요청됨 !!!');
    
    //userList() 함수를 호출한다.
    
    
    if(database) {
        UserModel.findAll(function(err, docs){
            if(err) {
                res.end('findAll error')
            } else {
                if(docs) {
                    console.log(docs);
                    req.app.render('user_list', {userArr:docs}, function(err2, html){
                        if(err2) throw err2;
                        res.end(html);
                    });
                } else {
                    res.end('findAll error 사용자 없음');
                }
            }
        });
    } else {
        res.end('DB Connect error');
    }
})

router.route('/process/detail').get((req, res)=>{
    console.log('/process/detail 요청됨 !!!');
    var id = req.query.id;
    console.log('id >>>> ', id);
    
    if(database) {
        UserModel.findById(id, function(err, doc){
            if(err) throw err;
            if(doc) {
                req.app.render('user_detail', {'userData':doc[0]}, function(err2, html){
                    if(err2) throw err2;
                    res.end(html);
                })
            } else {
                res.end('findById error 사용자 없음');
            }
        });
    } else {
      res.end('DB Connect error');  
    }
});

router.route('/process/usermodify').get((req, res)=>{
    console.log('/process/usermodify 요청됨 !!!');
})

router.route('/process/userdel').get((req, res)=>{
    console.log('/process/userdel 요청됨 !!!');
})

app.use('/', router); //=> 서버실행하기전 router 미들웨어
const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log('http://locahost:%d', app.get('port'));
    
    connectDB();
});

