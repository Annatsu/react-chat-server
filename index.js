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


serverSocket.on('connection', (socket) => {
    console.log('An user has connected');
});
