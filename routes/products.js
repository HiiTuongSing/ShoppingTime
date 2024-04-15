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

//create product
router.get("/new", async (req, res) => {
  try {
    const product = new Product();
    res.render("products/new", { product: product });
  } catch {
    res.redirect("/");
  }
});

router.post("/", async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
    });
    await product.save();
    const products = await Product.find({});
    res.render("products/index", { products: products });
  } catch (err) {
    console.error(err);
  }
});

//delete product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    const products = await Product.find({});
    res.render("products/index", { products: products });
  } catch (err) {
    console.error(err);
  }
});

//show product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("products/show", { product: product });
  } catch (err) {
    console.error(err);
  }
});

//edit product
router.get("/:id/edit", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("products/edit", { product: product });
  } catch (err) {
    console.error(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.name = req.body.name;
    product.price = req.body.price;
    product.stock = req.body.stock;
    await product.save();
    res.render("products/show", { product: product });
  } catch (err) {
    console.error(err);
  }
});
module.exports = router;
