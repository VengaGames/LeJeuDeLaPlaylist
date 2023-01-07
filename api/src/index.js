require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
const { connectToIoServer } = require("./socket");

app.use(cors());

app.use("/youtube", require("./controllers/youtube"));

app.get("/", async (req, res) => {
  return res.status(200).send({ message: "Hello world", last_deployed_at: new Date().toLocaleString() });
});

const server = http.createServer(app);
connectToIoServer(server);
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});

module.exports = app;
