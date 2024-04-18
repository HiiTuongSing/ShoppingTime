const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.render("carts/index");
  } catch {
    redirect("/");
  }
});

module.exports = router;
