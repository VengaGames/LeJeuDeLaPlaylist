const express = require("express");
const router = express.Router();
const { getRooms, removeUser, getUser, getUsersInRoom } = require("../utils/users");
const { getSettings, setSettings } = require("../utils/settings");

router.get("/", async (req, res) => {
  try {
    const rooms = getRooms();
    res.status(200).send({ data: rooms, ok: true });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: e.message, ok: false });
  }
});

router.get("/settings/:room", async (req, res) => {
  try {
    const { room } = req.params;
    const settings = getSettings(room);
    if (!settings) return res.status(404).send({ message: "Room not found", ok: false });
    res.status(200).send({ data: settings, ok: true });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: e.message, ok: false });
  }
});

const roomController = (module.exports = router);

roomController.handleSocket = (socket, io) => {
  socket.on("audio-for-everyone", (value) => {
    try {
      const user = getUser(socket.id);
      setSettings(user.room, "audioEveryone", value);
      io.to(user.room).emit("audio-for-everyone-confirm", value);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("leave-room", () => {
    try {
      const user = removeUser(socket.id);
      const usersInRoom = getUsersInRoom(user.room);

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });

      if (usersInRoom.every((user) => user.videoSelected)) {
        io.to(user.room).emit("all-videos-selected", true);
      }
    } catch (error) {
      console.log(error);
    }
  });
};
