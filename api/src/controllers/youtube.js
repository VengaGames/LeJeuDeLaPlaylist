const axios = require("axios");
const express = require("express");
const router = express.Router();
const KEY = process.env.YOUTUBE_API_KEY;
const { addSong, removeSong, getPlaylist, getFirstSong } = require("../utils/playlist");
const { modifyUser, getUsersInRoom, getUser } = require("../utils/users");

router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    const { data } = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURI(q + " audio")}&key=${KEY}&videoCategoryId=10&regionCode=US&type=video`,
    );
    res.status(200).send({ data: data, ok: true });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: e.message, ok: false });
  }
});

const ytVideoController = (module.exports = router);

ytVideoController.handleSocket = (socket, io) => {
  socket.on("select-video", (video) => {
    try {
      const user = getUser(socket.id);
      const usersInRoom = getUsersInRoom(user.room);
      if (!video) {
        modifyUser(socket.id, "videoSelected", false);
        io.to(user.room).emit("roomData", {
          room: user.room,
          users: usersInRoom,
        });
        return;
      }
      addSong(video, user.room);
      modifyUser(user.id, "videoSelected", true);

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: usersInRoom,
      });
      if (usersInRoom.every((user) => user.videoSelected)) {
        io.to(user.room).emit("all-videos-selected", true);
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("next-music", () => {
    try {
      const user = getUser(socket.id);
      const users = getUsersInRoom(user.room);
      const playlist = getPlaylist(user.room);
      if (playlist.length === 0) {
        users.forEach((user) => modifyUser(user.id, "videoSelected", false));
        io.to(user.room).emit("the-next-music", null);
        io.to(user.room).emit("all-videos-selected", false);
        io.to(user.room).emit("roomData", {
          room: user.room,
          users: users,
        });
        return;
      }
      if (user.admin) {
        const song = getFirstSong(user.room);
        io.to(user.room).emit("the-next-music", song.video);
        removeSong(song.video, user.room);
        io.to(user.room).emit("roomData", {
          room: user.room,
          users: users,
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("audio-for-everyone", (value) => {
    try {
      const user = getUser(socket.id);
      io.to(user.room).emit("audio-for-everyone-confirm", value);
    } catch (error) {
      console.log(error);
    }
  });
};
