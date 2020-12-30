const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const flash = require("express-flash");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");

const app = express();

const passportModule = require("./config/passport");
const initializePassport = passportModule.initialize;

initializePassport(passport);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

const User = require("./User");

const username = process.env.USERNAME;
const password = process.env.PASSWORD;

mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.cstov.mongodb.net/usersDB?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

app.use(cookieParser());
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(flash());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride("_method"));

app.use('/', require('./api/auth/routes.js'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
