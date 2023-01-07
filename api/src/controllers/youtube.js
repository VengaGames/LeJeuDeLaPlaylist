const axios = require("axios");
const express = require("express");
const router = express.Router();
const KEY = process.env.YOUTUBE_API_KEY;
const { addSong, removeSong, getPlaylist } = require("../utils/playlist");
const { modifyUser, getUsersInRoom, getUser } = require("../utils/users");

router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    const { data } = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURI(q + " audio")}&key=${KEY}&videoCategoryId=10&regionCode=US&type=video`,
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
      const users = getUsersInRoom(user.room);
      if (!video) {
        modifyUser(socket.id, "videoSelected", false);
        io.to(user.room).emit("roomData", {
          room: user.room,
          users: users,
        });
        return;
      }
      addSong(video);
      modifyUser(user.id, "videoSelected", true);

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: users,
      });
      if (users.every((user) => user.videoSelected)) {
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
      const playlist = getPlaylist();
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
        io.to(user.room).emit("the-next-music", playlist[0]);
        removeSong(playlist[0]);
        io.to(user.room).emit("roomData", {
          room: user.room,
          users: users,
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
};
