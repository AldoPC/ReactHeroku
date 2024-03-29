var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const sessions = require("express-session");
const dotenv = require("dotenv");
dotenv.config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
let biciRouter = require("./routes/bicicletas");
let biciRouterAPI = require("./routes/api/bicicletas");
let usuariosAPIRouter = require("./routes/api/usuarios");

let usuariosRouter = require("./routes/usuarios");
let tokenRouter = require("./routes/token");

var app = express();

//Setup mongoose
var mongoose = require("mongoose");
var mongoDB = process.env.MONGODB_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error: "));
db.on("open", console.log.bind(console, "MongoDB connection ok "));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//Sessions
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: "mysupersecretkey",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/bicicletas", biciRouter);
app.use("/api/bicicletas", biciRouterAPI);
app.use("/api/usuarios", usuariosAPIRouter);
app.use("/usuarios", usuariosRouter);
app.use("/token", tokenRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
