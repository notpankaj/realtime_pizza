const path = require("path");
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const app = express();

const PORT = process.env.PORT || 3000;

// set Template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// Assets
app.use(express.static("public"));
app.get("/", (_, res) => res.render("home"));
app.get("/cart", (_, res) => res.render("customers/cart"));
app.get("/register", (_, res) => res.render("auth/register"));
app.get("/login", (_, res) => res.render("auth/login"));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
