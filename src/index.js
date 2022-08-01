const path = require('path');
const http =  require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words')

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

// console.log(new Filter())

io.on('connection', (socket) => {

    socket.emit('message', greeting);
    socket.broadcast.emit('message', 'A new user joined')
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        if (filter.isProfane(message)) return callback('Profane words not allowed!')

        io.emit('message', message);
        callback()
    })

    // listen to sendLocation event on the server
    socket.on('sendLocation', (sendLocation, callback) => {
        io.emit('message', `My location: https://google.com/maps?q=${sendLocation.latitude},${sendLocation.longitude} `);

        callback('Location shared!')
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
