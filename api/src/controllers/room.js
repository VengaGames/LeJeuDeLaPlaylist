const express = require("express");
const router = express.Router();
const { getRooms } = require("../utils/users");
router.get("/", async (req, res) => {
  try {
    const rooms = getRooms();
    res.status(200).send({ data: rooms, ok: true });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: e.message, ok: false });
  }
});

module.exports = router;
