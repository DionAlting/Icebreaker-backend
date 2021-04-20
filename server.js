require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const http = require("http");
const socketIo = require("socket.io");

app.use(helmet());
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const options = {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
};

const io = socketIo(server, options);

function onConnect(socket) {
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
}

io.on("connection", onConnect);

const port = 4001;

function onListen() {
  console.log(`Listening on ${port}`);
}

// Start the app
server.listen(port, onListen);
