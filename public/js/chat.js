const socket = io();

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#submission').addEventListener('submit', (e) => {
    e.preventDefault()
    // const message = document.querySelector('input').value;
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message)
})