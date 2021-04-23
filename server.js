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

const port = process.env.PORT || 4000;
const options = {
  cors: {
    origin: "https://ice-breaker.netlify.app",
    methods: ["GET", "POST"],
  },
};
const server = http.createServer(app);

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
      const newMadeQuestion = await Question.create(newQuestion);
      if (newMadeQuestion) {
        socket.broadcast.emit("new_question_for_user", newMadeQuestion);
        socket.emit("new_question", newMadeQuestion);
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("create_answer", async (userAnswer) => {
    try {
      const newCreatedAnswer = await Answer.create(userAnswer);
      if (newCreatedAnswer) {
        socket.broadcast.emit("new_answer_for_host", newCreatedAnswer);
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("all_questions", async () => {
    try {
      const allQuestions = await Question.findAll({
        where: { isAnswered: false },
        include: [{ model: Answer, attributes: ["answer"] }],
        order: [["id", "DESC"]],
      });
      socket.emit("fetched_questions", allQuestions);
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("get_answers_by_questionId", async (questionId) => {
    try {
      const question = await Question.findByPk(questionId);
      if (question) {
        const allYesAnswers = await Answer.findAll({
          where: { [Op.and]: [{ questionId }, { answer: true }] },
          attributes: ["answer"],
        });
        const allNoAnswers = await Answer.findAll({
          where: { [Op.and]: [{ questionId }, { answer: false }] },
          attributes: ["answer"],
        });

        const count = {
          questionId: question.id,
          yes: allYesAnswers.length,
          no: allNoAnswers.length,
        };

        socket.broadcast.emit("answer_count", count);
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("change_question_state", async (questionId) => {
    try {
      const question = await Question.findByPk(questionId);

      const updatedQuestion = question.update({
        isAnswered: true,
      });

      if (updatedQuestion) {
        socket.emit("question_status_changed", updatedQuestion);
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("create_user", async (name) => {
    try {
      const newUser = await User.create({ username: name });
      if (newUser) {
        socket.emit("created_user", newUser);
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  socket.on("login_host", async (user) => {
    try {
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
      }
    } catch (error) {
      console.log(error.message);
    }
  });
}

io.on("connection", onConnect);

function onListen() {
  console.log(`Listening on ${port}`);
}

server.listen(port, onListen);
