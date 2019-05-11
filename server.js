const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "myuser",
    password: "mypass",
    database: "smartbrain"
  }
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  //res.send(database.users);
  let result = db("users")
    .then(function(value) {
      res.send(value);
    })
    .catch(function(err) {
      res.send("an error occurred");
    });
});

// /signin --> POST = success/fail

app.post("/signin", signin.handleSignin(db, bcrypt));

// /register --> POST = user

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

// /profile/:userId--> GET = user

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

// /image --> PUT = user

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});
app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
