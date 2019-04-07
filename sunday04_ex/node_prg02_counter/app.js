const http = require('http');
const express  = require('express');
const cors = require('cors');

const app = express();
const router = express.Router();

app.use(cors());

let cnt = 0;
router.route('/count').get((req, res)=> {
    cnt++;
    let date = new Date();
    let resData = {
        "dateStr": date.getHours() + ":" + date.getMinutes(),
        "count": cnt
    }
    
    res.end(JSON.stringify(resData));
});

app.use('/', router);
const server = http.createServer(app);
server.listen(3000, ()=>{
   console.log('http://localhost:3000 ...') ;
});