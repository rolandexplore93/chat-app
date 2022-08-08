const path = require('path');
const http =  require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessages, geoLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000
app.use(express.static(publicDirectoryPath));

let greeting = "Hey Rookie! \nWelcome to our team";

io.on('connection', (socket) => {
    console.log('Admin')
    // socket.emit('message', generateMessages(greeting));
    // socket.broadcast.emit('message', generateMessages('A new user joined'))
    
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room});

        if (error) return callback(error)

        socket.join(user.room);
        socket.emit('message', generateMessages('Admin', greeting));
        socket.broadcast.to(user.room).emit('message', generateMessages('Admin', `${user.username} joined ${user.room} group`));
        callback()
    });

    socket.on('sendMessage', (message, callback) => {
        const userData = getUser(socket.id);
        const filter = new Filter();
        if (filter.isProfane(message)) return callback('Profane words not allowed!');

        io.to(userData.room).emit('message', generateMessages(userData.username, message));
        callback()
    })

    // listen to sendLocation event on the server
    socket.on('sendLocation', (sendLocation, callback) => {
        const userData = getUser(socket.id);
        const locationUrl = `My location: https://google.com/maps?q=${sendLocation.latitude},${sendLocation.longitude}`
        io.to(userData.room).emit('locationMessage', geoLocationMessage(userData.username, locationUrl));;

        callback('Location shared!')
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user){
            io.to(user.room).emit('message', generateMessages('Admin', `${user.username} has left`));
        }
    })
})

server.listen(port, (req, res) => {
    console.log(`Listening to the server at port ${port}`)
});
