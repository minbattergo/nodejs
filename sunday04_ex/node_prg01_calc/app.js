const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const static = require('serve-static');

app.use(cors());

/*
// 4칙연산 처리가 되도록 한다.
app.get('/plus/:a/:b')
*/

app.use('/public', static(__dirname + "/public"));

//http://localhost:8888/plus/10/5
router.route('/plus/:a/:b').get((req, res)=>{
    let a = req.params.a; // 문자열 타입
    let b = req.params.b; // 문자열 타입
    let result = Number(a) + parseInt(b); // number타입

    res.end('<h1>' +String(result) + '</h1>');
})

router.route('/minus/:a/:b').get((req, res)=>{
    let a = req.params.a; // 문자열 타입
    let b = req.params.b; // 문자열 타입

    res.end('<h1>' +String(Number(a) - parseInt(b)) + '</h1>');
})

router.route('/multi/:a/:b').get((req, res)=>{
    res.end('<h1>' +String(Number(req.params.a) * parseInt(req.params.b)) + '</h1>');
})

router.route('/devide/:a/:b').get((req, res)=>{
    res.end('<h1>' +String(Number(req.params.a) / parseInt(req.params.b)) + '</h1>');
})

app.use('/', router);
const server = http.createServer(app);
server.listen(8888, ()=>{
    console.log('http://localhost:8888 실행중 !!!');
});

