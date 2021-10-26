///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 4000
// pull MONGODB_URL from .env
const { PORT = 4000, MONGODB_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middlware
const cors = require("cors");
const morgan = require("morgan");
// const session = require('express-session');
// const bcrypt = require('bcrypt');
// const sessionsController = require('./models/score');
// app.use('/sessions', sessionsController);
// const logger = require('morgan');

const scoresRouter = require('./routes/api/scores')
const usersRouter = require ('./routes/api/users');

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
});
// Connection Events
mongoose.connection
    .on("open", () => console.log("You are connected to mongoose"))
    .on("close", () => console.log("You are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

///////////////////////////////
// MODELS
////////////////////////////////
const GameSchema = new mongoose.Schema({
    title: String,
    image: String,
    progress: String,
    list: String
});

const Games = mongoose.model("Games", GameSchema);

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies
// app.use(logger('dev'));
// app.use('/api/scores', scoresRouter);
// app.use('/api/users', usersRouter);
// app.use (
//   session({
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: false
//   })
// );
///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
    res.send("hello world");
});

// GAME INDEX ROUTE
app.get("/games", async (req, res) => {
    try {
        // send all games
        res.json(await Games.find({}));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});


// GAME CREATE ROUTE
app.post("/games", async (req, res) => {
    try {
        // send all games
        res.json(await Games.create(req.body));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

// GAME DELETE ROUTE
app.delete("/games/:id", async (req, res) => {
    try {
      // send all games
      res.json(await Games.findByIdAndRemove(req.params.id));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
  // GAME UPDATE ROUTE
  app.put("/games/:id", async (req, res) => {
    try {
      // send all games
      res.json(
        await Games.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));