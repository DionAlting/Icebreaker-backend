require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const PORT = 4000;

app.use(helmet());
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
