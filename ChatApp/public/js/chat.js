const socket = io();

// socket.on("countUpdated", count => {
//   console.log("your count has been updated " + count);
// });

// const buttonIncrement = document.getElementById("increment");

// buttonIncrement.addEventListener("click", () => {
//   socket.emit("increment");
// });

//Elements

const $submitMessage = document.getElementById("submitMessage");
const $location = document.getElementById("location");
const $message = document.getElementById("message");
const $messages = document.getElementById("messages");
// const $users = document.getElementById("users");
const $roomData = document.getElementById("roomData");

// Templates

const messageTemplate = document.getElementById("message-template").innerHTML;
const messageTemplateLoggedUser = document.getElementById(
  "message-template-loggedUser"
).innerHTML;
const locationTemplate = document.getElementById("location-template").innerHTML;
const locationTemplateLoggedUser = document.getElementById(
  "location-template-loggedUser"
).innerHTML;
const roomDataTemplate = document.getElementById("roomData-template").innerHTML;

const { userName, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const autoScroll = () => {
  const $newMessage = $messages.lastElementChild; // new message element

  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin; // height of new element

  //Visiblle height
  const VisiblleHeight = $messages.offsetHeight;

  // Height of message container
  const containerHeight = $messages.scrollHeight;

  //How far i have scrolled

  const scrollOffset = $messages.scrollTop + VisiblleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("message", message => {
  const html = Mustache.render(
    userName === message.userName ? messageTemplateLoggedUser : messageTemplate,
    {
      userName: message.userName,
      message: message.text,
      createdAt: moment(message.createdAt).format("h:mm a")
    }
  );
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("locationMessage", location => {
  const html = Mustache.render(
    userName === location.userName
      ? locationTemplateLoggedUser
      : locationTemplate,
    {
      userName: location.userName,
      location: location.url,
      createdAt: moment(location.createdAt).format("h:mm a")
    }
  );
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

$submitMessage.addEventListener("click", () => {
  $submitMessage.setAttribute("disabled", "disabled");
  socket.emit(
    "clientMessage",
    document.getElementById("message").value,
    res => {
      $submitMessage.removeAttribute("disabled");
      $message.value = "";
      $message.focus();
    }
  );
});

// socket.on("allUsers", users => {
//   $users.innerHTML = "";
//   users.forEach(user => {
//     const html = Mustache.render(roomUsersTemplate, {
//       userName: user.userName
//     });
//     $users.insertAdjacentHTML("beforeend", html);
//   });
// });

socket.on("roomData", ({ room, users }) => {
  $roomData.innerHTML = "";
  users.forEach(user => {
    if (user.userName.toLowerCase() === userName.toLowerCase())
      user.userName = user.userName.concat(" (You)");
  });
  const html = Mustache.render(roomDataTemplate, {
    room,
    users
  });
  $roomData.insertAdjacentHTML("beforeend", html);
});

$location.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }
  $location.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      () => {
        $location.removeAttribute("disabled");
      }
    );
  });
});

socket.emit("join", { userName, room }, error => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
