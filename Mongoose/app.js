const express = require("express");
const bodyParser = require("body-parser");
const startServer = require("./utils/server");
const User = require("./models/user");

const path = require("path");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");

const errorController = require("./controllers/404");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("66946f58fdf6fc252309e567")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(userRoutes);

app.use(errorController.getPageNotFound);

startServer(app);
