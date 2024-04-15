const express = require("express");
const router = express.Router();
const Product = require("../models/product");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("products/index", { products: products });
  } catch {
    res.redirect("/");
  }
});

router.get("/new", async (req, res) => {
  try {
    res.render("products/new");
  } catch {
    res.redirect("/");
  }
});
module.exports = router;
