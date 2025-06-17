const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refreshTokenHandler,
} = require("../controllers/authController");
const passport = require("passport");

router.post("/register", register);
router.post("/login", login);

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

router.get("/", (req, res) => {
  res.send("<a href='/auth/google'>Login with Google</a>");
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  })
);

router.get(
  "/oauth",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/",
    failureRedirect: "/auth/fail",
  })
);

router.get("/fail", (req, res) => {
  res.send("fail");
});

router.get("/hello", isLoggedIn, (req, res) => {
  res.send(`Welcome ${req.user.displayName}`);
});

router.post("/refreshtoken", refreshTokenHandler);
module.exports = router;
