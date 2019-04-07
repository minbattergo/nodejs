var io = require('socket.io').listen(3000);

io.sockets.on('connection', function(socket){
    
    socket.on('message1', function(name, callback){
        
        console.log("name >>> ", name);
        callback('SUCCESS !!!');
        
        
    });
});


/*
    <script>
        var socket = io.connect('http://localhost:3000');
        socket.on('connect', function(){
             console.log('서버 소켓에 연결됨 ...');
             socket.emit('message1', 'HONG', function(msg) {
                 console.log('서버에서 보낸 메시지 >>>', msg);
             });
        });
    </script>
*/