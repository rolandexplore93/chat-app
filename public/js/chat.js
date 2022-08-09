const socket = io();
const $messageForm = document.querySelector("#submission");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#my-location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true})

// autoscroll on sending messages
const autoscroll = () => {
  // get new message element by target the rendered message element template
  const $newMessage = $messages.lastElementChild;

  // get the height of new message
  const $newMessageStyles = parseInt(getComputedStyle($newMessage).marginBottom)
  const $newMessageHeight = $newMessage.offsetHeight + $newMessageStyles
  // console.log($newMessageHeight)

  // Get visible height on your chat screen
  const visibleHeight = $messages.offsetHeight
  // console.log(visibleHeight)

  // Get the container height
  const containerHeight = $messages.scrollHeight
  // console.log(containerHeight)

  // Scrolling distance by user
  const scrollDistance = $messages.scrollTop + visibleHeight
  // console.log(scrollDistance)

  if (containerHeight - $newMessageHeight <= scrollDistance){
    $messages.scrollTop = $messages.scrollHeight
  }
}

socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("HH:mm a")
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll()
});

socket.on('locationMessage', (mapUrl) => {
  console.log(mapUrl);
  const getUrl = mapUrl.url.split(' ')[2];
  const html = Mustache.render(locationTemplate, {
    username: mapUrl.username,
    url: getUrl,
    createdAt: moment(mapUrl.createdAt).format("HH:mm a")
  })
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll()
})

socket.on('roomData', ({ room, users}) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", "disabled");
  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (serverResponse) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (serverResponse) return console.log(serverResponse);
  });
  
});

$sendLocationButton.addEventListener("click", (e) => {
  e.preventDefault();
  $sendLocationButton.setAttribute("disabled", "disabled");
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser!");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const sendLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    socket.emit("sendLocation", sendLocation, (serverResponse) => {
      console.log(serverResponse);
      // const locationHtml = Mustache.render(locationTemplate, {
      //   location: sendLocation
      // });
      // $messages.insertAdjacentHTML("beforeend", locationHtml);
      $sendLocationButton.removeAttribute("disabled");
    });
  });
});

socket.emit('join', { username, room }, (error) => {
  if (error){
    alert(error);
    location.href = '/'
  }
})
