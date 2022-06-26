const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io =new Server(server);
// server-side
const io = require("socket.io")(server, {
  cors: {
    credentials: false
  }
});
const PORT = process.env.PORT || 3000;
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
server.listen(PORT, () => {
  console.log('listening on *:3000');
});
