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

const { Op } = require("sequelize");

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

  socket.on("create_question", async (newQuestion) => {
    try {
      console.log(newQuestion);
      const newMadeQuestion = await Question.create(newQuestion);
      if (newMadeQuestion) {
        console.log(newMadeQuestion);
        socket.broadcast.emit("new_question_for_user", newMadeQuestion);
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("all_questions", async () => {
    const allQuestions = await Question.findAll({
      where: { isAnswered: false },
    });
    socket.emit("fetched_questions", allQuestions);
  });

  socket.on("create_user", async (name) => {
    const newUser = await User.create({ username: name });
    socket.emit("created_user", newUser);
  });

  socket.on("login_host", async (user) => {
    const { username, password } = user;
    const loggedInHost = await User.findOne({
      where: {
        [Op.and]: [{ password }, { username }],
      },
    });

    if (!loggedInHost) {
      const error = "User not found";
      socket.emit("error", error);
    } else {
      socket.emit("logged_in_host", loggedInHost);
      console.log(loggedInHost);
    }
  });
}

io.on("connection", onConnect);

const port = 4001;

function onListen() {
  console.log(`Listening on ${port}`);
}

// Start the app
server.listen(port, onListen);
