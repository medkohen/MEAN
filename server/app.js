var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

// mongodb+srv://user_01:<password>@cluster0.f480k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// mongoose.connect(
//   "mongodb+srv://user_01:Kohen123@cluster0.f480k.mongodb.net/mydb?retryWrites=true&w=majority",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true,
//   },
//   (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Connexion opened to MongoDB!");
//     }
//   }
// );

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
