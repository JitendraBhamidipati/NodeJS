const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const {
  generateMessage,
  generateLocationMessage
} = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

// let count = 0;

io.on("connection", socket => {
  // socket.emit("countUpdated", count);
  // socket.on("increment", () => {
  // count += 1;
  // socket.emit("countUpdated", count);  // Only for specific connection
  // io.emit("countUpdated", count); // for all connections
  // });
  socket.on("join", ({ userName, room }, callback) => {
    socket.join(room);
    const { error, user } = addUser({ id: socket.id, userName, room });
    const users = getUsersInRoom(user.room);
    if (error) return callback(error);

    socket.emit(
      "message",
      generateMessage("Admin", `Welcome ${user.userName}`)
    );
    io.to(user.room).emit("roomData", { room: user.room, users });
    // io.to(user.room).emit("allUsers", users);
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage("Admin", `${user.userName} has joined`));
    callback();
  });

  socket.on("clientMessage", (message, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", generateMessage(user.userName, message));
      callback("Delivered!");
    }
  });

  socket.on("sendLocation", (data, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "locationMessage",
        generateLocationMessage(
          user.userName,
          `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
        )
      );
      callback();
    }
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      const users = getUsersInRoom(user.room);
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.userName} has left the room`)
      );
      io.to(user.room).emit("roomData", { room: user.room, users });
      // io.to(user.room).emit("allUsers", users);
    }
  });
});

app.use(express.static(publicDirectoryPath));

server.listen(port, () => {
  console.log(`App is running at port ${port}!`);
});
