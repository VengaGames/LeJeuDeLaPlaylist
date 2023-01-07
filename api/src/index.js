const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/", async (req, res) => {
  return res.status(200).send({ message: "Hello world", last_deployed_at: new Date().toLocaleString() });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});

module.exports = app;
