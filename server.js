require("dotenv").config();
const path = require("path");
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const initWebRoutes = require("./routes/web");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoStore = require("connect-mongo");

const app = express();
const PORT = process.env.PORT || 3000;

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

app.use(flash());

// Assets
app.use(express.static("public"));
app.use(express.json());

//Global Middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// set Template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// Routes
initWebRoutes(app);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
