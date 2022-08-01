const socket = io();
const $messageForm = document.querySelector("#submission");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#my-location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
console.log(messageTemplate);

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message: message.message,
  });
  $messages.insertAdjacentHTML("beforebegin", html);
});

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
      $sendLocationButton.removeAttribute("disabled");
    });
  });
});
