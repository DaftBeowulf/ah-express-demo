// third-party imports
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

//inter-app imports
const userRouter = require("./data/controllers/users");
const postRouter = require("./data/controllers/posts");
const noBTC = require("./data/controllers/middleware");

//init server
const server = express();

//use middleware
server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(noBTC);

//sanity check
server.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Server's totally running, you're totally sane" });
});

//implement routes
server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);

module.exports = server;
