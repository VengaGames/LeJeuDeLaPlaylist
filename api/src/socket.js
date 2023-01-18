const { Server } = require("socket.io");
const { addUser, removeUser, getUsersInRoom } = require("./utils/users");

exports.connectToIoServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", ({ name, room }, callback) => {
      try {
        const { user } = addUser({ id: socket.id, name, room });
        if (!user) return;

        console.log(`${user.name} joined ${user.room}`);

        socket.join(user.room);

        io.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });
        if (callback) callback();
      } catch (e) {
        console.log(e);
      }
    });

    require("./controllers/youtube").handleSocket(socket, io);
    require("./controllers/room").handleSocket(socket, io);

    socket.on("disconnect", () => {
      try {
        const user = removeUser(socket.id);
        if (!user) return;
        console.log(`${user.name} left ${user.room}`);
        io.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
};
