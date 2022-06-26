const io =require('socket.io')(4444);
// CORS POLICY FOR OUR CLIENT HAS TO BE DISABLED
const users = {};
// Empty object
// io listens to every connection made in the application
// socket.on takes care of any particular connection based on arguments received
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