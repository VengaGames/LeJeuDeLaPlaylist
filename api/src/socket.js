const { Server } = require("socket.io");
const http = require("http");
const app = require("./index");
const server = http.createServer(app);
const { addUser, removeUser, getUser, getUsersInRoom, getAdmin } = require("./utils/users");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    console.log("user joined " + user.room);

    if (error) return callback(error);

    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    console.log("user disconnected" + user.name);
  });
});

module.exports = io;
