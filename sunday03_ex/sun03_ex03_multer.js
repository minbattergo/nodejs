//sun03_ex02_session.js

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();
const static = require('serve-static');
const multer = require('multer');

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

//multer 미둘웨어사용:
//순서 : body-parser -> multer -> router 순서로 실행
let storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null,'uploads')
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname + Date.now());
    }
});

//멀터 객체생성(파일 제한 설정)
let upload = multer({
    storage: storage,
    limits:{
        files:10,
        fileSize: 1024 * 1024 * 1024
    }
})

router.route('/process/photo').post(upload.array('photo', 1),function(req, res){
    console.log('photo 요청 됨.');
    
    res.end('file upload test !!!!');
});

app.use('/', router); //=> 서버실행하기전 router 미들웨어
const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
   console.log('http://locahost:%d', app.get('port'));
});

