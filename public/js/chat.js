const socket = io();

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#submission').addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (serverResponse) => {
        if (serverResponse) return console.log(serverResponse)
    })
})

document.querySelector('#my-location').addEventListener('click', (e) => {
    e.preventDefault()
    if (!navigator.geolocation){
        return alert('Geolocation is not supported by your browser!')
    }
    
    navigator.geolocation.getCurrentPosition((position) => {
        const sendLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        socket.emit('sendLocation', sendLocation, (serverResponse) => {
            console.log(serverResponse)
        })
    })
})