// add all your boilerplate code up here
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// new requires for passport
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

// allows using dotenv for environment variables
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// set up session
app.use(
  session({
    secret: process.env.SECRET, // stores our secret in our .env file
    resave: false, // other config settings explained in the docs
    saveUninitialized: false,
  })
);

// set up passport
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

// passport needs to use MongoDB to store users
mongoose.connect("mongodb://localhost:27017/usersDB", {
  useNewUrlParser: true, // these avoid MongoDB deprecation warnings
  useUnifiedTopology: true,
});

// This is the database where our users will be stored
// Passport-local-mongoose handles these fields, (username, password),
// but you can add additional fields as needed
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// configure passportLocalMongoose
userSchema.plugin(passportLocalMongoose);

// Collection of users
const User = new mongoose.model("User", userSchema);

// more passport-local-mongoose config
// create a strategy for storing users with Passport
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const port = 3000;

app.listen(port, function () {
  console.log("Server is running on port " + port);
});

// root route
app.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    // pass the username to EJS
    res.render("index", { name: req.user.username, isAuth: true });
  } else {
    res.render("index", { isAuth: false });
    console.log(123);
  }
});

// register route
app.post("/register", function (req, res) {
  console.log("Registering a new user");
  // calls a passport-local-mongoose function for registering new users
  // expect an error if the user already exists!
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
          console.log(err);
          res.status(400).send(err);
      } else {
        // authenticate using passport-local
        // what is this double function syntax?! It's called currying.
        passport.authenticate("local")(req, res, function () {
          res.send('Success signup');
        });
      }
    }
  );
});

// login route
app.post("/login", function (req, res) {
  // create a user
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  // try to log them in
  req.login(user, function (err) {
    if (err) {
      // failure
      res.send(err);
    } else {
      // success
      // authenticate using passport-local
      passport.authenticate("local")(req, res, function () {
        res.send({message: "Success signin"});
      });
    }
  });
});

// This syntax does mostly the same thing, but less intuitive and not as easy to debug
// app.post('/login', passport.authenticate('local', { successRedirect: '/welcome',
//                                                      failureRedirect: '/'}));

// logout
app.get("/logout", function (req, res) {
  console.log("A user logged out");
  req.logout();
  res.redirect("/");
});
