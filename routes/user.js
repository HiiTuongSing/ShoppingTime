const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const users = await User.find({});

    if (req.isAuthenticated()) {
      const user = await User.findById(req.user);
      res.render("users/index", { users: users, id: user.id });
    } else {
      res.render("users/index", { users: users, id: "Not logged in" });
    }
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    const users = await User.find({});
    res.render("users/index", { users: users });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

module.exports = router;
