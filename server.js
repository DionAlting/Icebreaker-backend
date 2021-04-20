require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const http = require("http");
const socketIo = require("socket.io");

const User = require("./models/").user;
const Question = require("./models/").question;
const Answer = require("./models/").answer;

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

  socket.on("connect", () => {
    console.log("user connected");
  });

  socket.on("get_user", async () => {
    console.log("fetching user... ");
    const test = await User.findAll();
    //console.log(test);
    socket.emit("all_users", test);
  });
}

io.on("connection", onConnect);

const port = 4001;

function onListen() {
  console.log(`Listening on ${port}`);
}

// Start the app
server.listen(port, onListen);
