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
        db = conn.db('vehicle');
        console.log('DB Connection Success !!! : ' + dbUrl);
        
    });
} //end of cpmmectDB

//DataBase 처리부분만 분리시킴
function carList(database, callback) {
    var car = database.collection('car');
    
        car.find({}).toArray(function(err, docs){
            if(err2) {
                callback(err2, null) ;
                return;
            }                
            callback(null, docs);
            
            }); 
        });
}

//route path 설정 부분
router.route('/car_list').get(function(req, res){
    console.log('car list 요청 됨');
    
    if(db){
        carList(db, function(err,docs){
            if(err) throw err;
            
            //브라우저 화면에 처리할 내요은 ejs에 넘겨준다.
            req.app.render('car_list', {'carArr' : docs}, (err2, html)=> {
                if(err2) throw err2;
                
                res.end(html);
            }); 
        })
    }

/*  한번에 처리한 경우  
    if(db) {
        var car = db.collection('car');
        car.find({}).toArray(function(err, docs){
           //console.log(docs);
            req.app.render('car_list', {'carArr' : docs}, (err2, html)=> {
                if(err2) throw err2;
                
                res.end(html);
            }); 
        });
    }*/
});

app.use('/', router); //=> 서버실행하기전 router 미들웨어
const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log('http://locahost:%d', app.get('port'));
    
    connectDB();
});

