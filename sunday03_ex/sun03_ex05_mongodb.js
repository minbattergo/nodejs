/* sun03_ex05_mongodb */

var MongoClient = require('mongodb');

MongoClient.connect('mongodb://localhost', function(err, conn){
    if(err) throw err;
    
    let db = conn.db("vehicle");
    db.collection('car').findOne({}, function(err, doc){
        if(err) throw err2;
        
        console.log('doc name >>>> ', doc.name)
        
        conn.close();
    });
});