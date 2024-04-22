const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("express-flash");
const session = require("express-session");
const User = require("../models/user");

router.use(flash());
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
router.use(passport.initialize());
router.use(passport.session());

const authenticateUser = async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return done(null, false, { message: "No user with that email" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Password incorrect" });
    }
  } catch (e) {
    return done(e);
  }
};

passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  return done(null, id);
});

router.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    // User is authenticated, proceed to dashboard
    const user = await User.findById(req.user);

    res.render("index", { user: user });
  } else {
    // User is not authenticated, redirect to login
    res.redirect("/login");
  }
});

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();

    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.redirect("/register");
  }
});

router.delete("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

module.exports = router;
