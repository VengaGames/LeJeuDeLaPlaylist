const axios = require("axios");
const express = require("express");
const router = express.Router();
const KEY = process.env.YOUTUBE_API_KEY;
console.log(KEY);
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

module.exports = router;
