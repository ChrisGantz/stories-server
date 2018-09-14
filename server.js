"use strict";

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
// added passport
const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./passport/strategies");
const { PORT, MONGODB_URI, CLIENT_ORIGIN } = require("./config");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
// const bodyParser = require("body-parser");

mongoose.Promise = global.Promise;

const app = express();

app.use(
  morgan(process.env.NODE_ENV === "production" ? "common" : "dev", {
    skip: (req, res) => process.env.NODE_ENV === "test"
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use(express.json());
// app.use(bodyParser.json());

passport.use(localStrategy);
passport.use(jwtStrategy);
// Mount Routers
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);

// // A protected endpoint which needs a valid JWT to access it
// const jwtAuth = passport.authenticate("jwt", { session: false });
// app.get("/api/protected", jwtAuth, (req, res) => {
//   return res.json({
//     data: "rosebud"
//   });
// });

// Custom Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(MONGODB_URI)
    .then(instance => {
      const conn = instance.connections[0];
      console.info(
        `Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`
      );
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error("\n === Did you remember to start `mongod`? === \n");
      console.error(err);
    });
  app
    .listen(PORT, function() {
      console.info(`Server listening on ${this.address().port}`);
    })
    .on("error", err => {
      console.error(err);
    });
}

module.exports = app;
