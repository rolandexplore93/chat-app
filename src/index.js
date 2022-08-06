const path = require('path');
const http =  require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const generateMessages = require('./utils/messages');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000
app.use(express.static(publicDirectoryPath));

let greeting = "Dear Anonymous! \nWelcome to our team";

io.on('connection', (socket) => {

    socket.emit('message', generateMessages(greeting));
    socket.broadcast.emit('message', generateMessages('A new user joined'))
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        if (filter.isProfane(message)) return callback('Profane words not allowed!')

        io.emit('message', generateMessages(message));
        callback()
    })

    // listen to sendLocation event on the server
    socket.on('sendLocation', (sendLocation, callback) => {
        io.emit('locationMessage', `My location: https://google.com/maps?q=${sendLocation.latitude},${sendLocation.longitude} `);

        callback('Location shared!')
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessages('A user has left'));
    })
})

server.listen(port, (req, res) => {
    console.log(`Listening to the server at port ${port}`)
});
