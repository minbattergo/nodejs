const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const router = express.Router();

app.use(cors());

var messages = [];

router.route('/recieve').get((req, res) => {
    if(req.query.size >= messages.length) {
        res.end();
    } else {
        var result = {
            messages: messages.slice(req.query.size),
            total: messages.length
            
        }
        res.end(JSON.stringify(result));
    }
    
});

router.route('/send').get((req, res) => {
    messages.push({
        sender : req.query.sender,
        message : req.query.message
    });

    res.end();
});

app.use('/', router);
const server = http.createServer(app);
server.listen(3000, function() {
    console.log('http://localhost:3000 .....');
});
