require("dotenv").config();
require("./config/DB");

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const app = express();

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: "cats",
    resave: false,
    saveUninitialized: false,
  })
);
// Globale Error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || Error,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

const users = require("./Routes/users");
const auth = require("./Routes/auth");
const { Error } = require("./utils/httpStatusText");

app.use("/api/auth", auth);
app.use("/api/user", users);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
