/* sun03_ex09_mongoose.js */

var http = require('http');
var express = require('express');
var app = express();
var router = express.Router();

var mongoose = require('mongoose');

app.set('port', process.env.PORT || 3000);

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
        
        UserModel = mongoose.model('users', UserSchema);
    });//open일때
    
    //연결이 끊어졌을때 5초후 재연결
    database.on('disconnected', function(){
        console.log('연결이 끊어 졌습니다. 5초후 다시 연결합니다.') ;
        setTimeout(connectDB, 5000);
    });
}

app.use('/', router);
var server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log('http://localhost:%d', app.get('port'));
    connectDB();
});