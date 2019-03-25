// sunday02_ex06_bodyParser.js
const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();
const static = require('serve-static');
const path = require('path');
const bodyParser = require('body-parser');
const util = require('util');

app.set('port', process.env.PORT || 80);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', static(path.join(__dirname, 'public')) );

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


router.route('/').get((req,res)=>{
    console.log('/ 페이지로 요청');
    //res.end('/ page');
    res.redirect('/index.html');
});

router.route('/home').get((req, res)=>{
    console.log('/home 페이지 요청');
    
    //res.end('/home page');
    req.app.render('home', {}, (err, html)=>{
        if(err) throw err;
        
        res.end(html);
    });
});

router.route('/process/login').post((req, res)=>{
    console.log('/process/login 페이지 요청');
    
    let paramId = req.body.id || req.query.id;
    let paramPass = req.body.password || req.query.password;
    let user = {
        id : paramId,
        password : paramPass
    };
    
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    res.end(util.format('login 처리 페이지 : %j', user));
});

app.use('/', router);

const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log('localhost:%d', app.get('port'));
});