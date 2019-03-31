/*
sun03_ex01_cookieparser
*/

const http = require('http');
const express = require('express');

const app = express();
const router = express.Router();

const cookieParser = require('cookie-parser');
//cookieParser 실행
app.use(cookieParser());

router.route('/process/setUserCookekie').get(function(req, res){
    console.log('/process/setUserCookekie');
    
    res.cookie('user', {
        id : "ssun",
        name : "태산",
        autrozed: true
    });
    
    res.redirect('/process/showCookie');
});

router.route('/process/showCookie').get((req, res) => {
    console.log('/process/showCookie 불러짐 !!!')
    
    res.send(req.cookies); //쿠기는 여러개, 모든 쿠기를 가져온다. cookies 복수설정
});

app.use('/', router); //미들웨어 설정

const server = http.createServer(app);
server.listen(3000, function(){
   console.log('http://localhost:3000');
});