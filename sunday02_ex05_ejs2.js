var http = require('http');
var express = require('express');
var static = require('serve-static');

var app = express();
var router = express.Router();

// npm install ejs --save
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// static 미들웨어 설정
app.use('/public', static(__dirname + '/public'));

router.route('/car_list').get(function(req, res) {
    console.log('/car_list 요청 됨');
    
    var carList = [{
        name: 'Sonata',
        price: 2000, 
        company: '현대'
    },{
        name: 'SM6',
        price: 2800, 
        company: '삼성'
    },{
        name: 'K7',
        price: 3000, 
        company: '기아'
    }];
    
    req.app.render('car_list', {"carList": carList}, function(err, html) {
        if(err) {
            //res.end('ejs rendering error!!!!');
            throw err;
        }
        
        res.end(html);
    });
});

app.use('/', router);

var server = http.createServer(app);
server.listen(3000, function() {
    console.log('localhost:3000');
});