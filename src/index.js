const path = require('path');
const http =  require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000
app.use(express.static(publicDirectoryPath));

let greeting = {
    message: "Welcome Anonymous!",
    no: 250
}

io.on('connection', (socket) => {

    socket.emit('message', greeting);
    socket.broadcast.emit('message', 'A new user joined')
    socket.on('sendMessage', (message) => {
        io.emit('message', message);
    })

    // listen to sendLocation event on the server
    socket.on('sendLocation', (sendLocation) => {
        io.emit('message', `My location: https://google.com/maps?q=${sendLocation.latitude},${sendLocation.longitude} `)
    })


    socket.on('disconnect', () => {
        io.emit('message', 'A user has left');
    })
})



















// io.on('connection', (socket) => {
//     console.log("New Web Socket connection")
//     // socket.emit('countUpdated', count)

//     // socket.on('increment', () => {
//     //     count++
//     //     console.log(count)

//     //     io.emit('countUpdated', count) // io.emit emits to all connections
//     // })
// })

server.listen(port, (req, res) => {
    console.log(`Listening to the server at port ${port}`)
});
