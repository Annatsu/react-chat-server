// Node Modules
const express = require('express');
const http = require('http');
const io = require('socket.io');
const path = require('path');


// Setup the port that the server will listen to.
const SERVER_PORT = process.env.PORT || 8081;



// Creates working constants
const app = express();
const server = http.Server(app);
const serverSocket = io(server);



// Listens to the root endpoint.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Initiates the server.
server.listen(SERVER_PORT, () => {
    console.log(`Server listening at port ${SERVER_PORT}`);
});



// Configures the Socket.io data and data flow.
const connectedUsers = [];

serverSocket.on('connection', (socket) => {
    socket.on('sendMessage', (msg) => {
        serverSocket.emit('newMessage', {
            user: socket.username,
            body: msg
        });
    });


    socket.on('newUser', (username) => {
        if (connectedUsers.includes(username))
            return socket.emit('invalidUsername', username);

        // Set the socket username.
        socket.username = username;
        connectedUsers.push(username);

        // Emit a login event so the user can enter the chat.
        socket.emit('login', {
            users: connectedUsers
        });

        // Tell everyone else that a new user joined the server.
        socket.broadcast.emit('userConnected', {
            username
        });
    });


    socket.on('disconnect', () => {
        // Remove the user from the connectedUsers array.
        connectedUsers.splice(connectedUsers.findIndex((user) => user === username), 1);
    });
});
