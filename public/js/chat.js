const socket = io();
const $messageForm = document.querySelector("#submission");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#my-location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

const aa = Qs.parse(location.search, { ignoreQueryPrefix: true})
console.log(aa)

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("HH:mm a")
  });
  $messages.insertAdjacentHTML('beforeend', html)
});

socket.on('locationMessage', (mapUrl) => {
  console.log(mapUrl);
  const getUrl = mapUrl.url.split(' ')[2];
  const html = Mustache.render(locationTemplate, {
    url: getUrl,
    createdAt: moment(mapUrl.createdAt).format("HH:mm a")
  })
  $messages.insertAdjacentHTML('beforeend', html)
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
