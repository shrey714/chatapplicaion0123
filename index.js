var express = require('express');
var app = express();
app.use(express.static('public')); 
var http = require('http').Server(app);
var port = process.env.PORT || 3001;

// setup my socket server
var io = require('socket.io')(http);
const users = {};

app.get('/', (req, res) => {
  res.write('<h1>server running 1234..</h1>');
  res.end();
});
io.on('connection', socket => {

    // What is to be broadcasted when new server joins
    socket.on('new-user-joined', names => {
        console.log("New user", names);
        users[socket.id] = names;
        socket.broadcast.emit('user-joined', names);
    });

    // What is to be broadcasted when message is received 
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message_received: message, names: users[socket.id] })
    });

    // What is to be broadcasted when a client leaves the server 
    socket.on('disconnect', data => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

    // Here by broadcasted we can say the server(index.js) makes the client.js to call the respective send,receive,disconnect functions 
})
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

http.listen(port, function() {
    console.log('listening on *: ' + port);
});
