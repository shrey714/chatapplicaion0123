// const socket = io('https://chatapplication0123.herokuapp.com/',{
//     withCredentials: true,
//     extraHeaders: {
//       "my-custom-header": "abcd"
//     }
// });
var socket = io();
const form = document.getElementById('send-container')
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector('.container')


var audio = new Audio('ding-36029.mp3');

// Function to add div as well as play audio
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = position;
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

// Function to remove heading inside container
const remove_heading=()=>{
    const element = document.getElementById("container-heading");
    if (element!=null){
    element.remove();
    }
}


// Sending messages to server which will be visible to other clients 
form.addEventListener('submit', (e) => {

    remove_heading()
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';


})
const names = prompt("Enter your name");
socket.emit('new-user-joined', names);

socket.on('user-joined', names => {
    remove_heading()
    append(`${names} joined the chat`, 'left')
});

// Receiving the message from the server 
socket.on('receive', data => {
    remove_heading()
    append(`${data.names}: ${data.message_received}`, 'left')
});

socket.on('left', names => {
    remove_heading()
    append(`${names} left the chat`, 'left')
});




