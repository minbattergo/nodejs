/* sun03_ex04_mongojs */

var mongojs = require('mongojs'); // 단점 : local의 있는 것만 사용가능
var db = mongojs('vehicle', ['car']);

db.car.find(function(err,data){
    console.log(data);
})

