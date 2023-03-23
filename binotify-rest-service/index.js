const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
require("dotenv").config();
const { sequelize } = require("./models");
const config = require("./config/config.js");

const app = express();
app.use(morgan("combined"));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());
app.use(
  session({
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    httpOnly: false,
    cookie: {
      maxAge: parseInt(process.env.SESSION_LIFETIME),
      sameSite: "lax",
      secure: false,
    },
  })
);

require("./routes")(app);

sequelize.sync({ force: false }).then(() => {
  console.log(config.port);
  app.listen(config.port);
});
