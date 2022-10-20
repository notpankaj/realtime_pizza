require("dotenv").config();
const path = require("path");
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const initWebRoutes = require("./routes/web");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const app = express();
const PORT = process.env.PORT || 3000;
const Emitter = require("events");

// Database connection
const DB_URI = "mongodb://localhost:27017/pizza";
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", (err) => {
  console.log("err", err);
});
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected");
});

app.use(flash());

// Event Emitter
const eventEmitter = new Emitter();
// bind to the application
app.set("eventEmitter", eventEmitter);

// Session config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: DB_URI }),
    maxAge: 1000 * 60 * 60 * 24,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
  })
);

// Passport config
app.use(passport.initialize());
app.use(passport.session());
const passportInit = require("./app/config/passport");
passportInit(passport);

// Assets
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Global Middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

// set Template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// Routes
initWebRoutes(app);

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Socket
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  // Join
  // console.log(socket.id, "s-id");
  socket.on("join", (orderId) => {
    socket.join(orderId);
  });
});

eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});
eventEmitter.on("orderPlaced", (data) => {
  io.to(`adminRoom`).emit("orderPlaced", data);
});
