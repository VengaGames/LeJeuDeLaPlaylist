const express = require("express");
const router = express.Router();
const { getRooms } = require("../utils/users");
const { getSettings } = require("../utils/settings");

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

module.exports = router;
