const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const imageMimeType = ["image/jpeg", "image/png", "image/gif"];
const User = require("../models/user");

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
      description: req.body.description,
    });
    saveCover(product, req.body.image);
    await product.save();
    const products = await Product.find({});
    res.render("products/index", { products: products });
  } catch (err) {
    console.error(err);
  }
});

function saveCover(product, encodedImage) {
  if (encodedImage == null) return;
  const image = JSON.parse(encodedImage);
  if (image != null && imageMimeType.includes(image.type)) {
    product.image = new Buffer.from(image.data, "base64");
    product.imageType = image.type;
  }
}

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

//add to cart
router.get("/:id/add", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.render("products/addToCart", {
      product: product,
    });
  } catch {
    res.redirect("/");
  }
});

router.put("/:id/add", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const user = await User.findById(req.user);

    //Make changes to product database
    const quantity = req.body.quantity;
    if (product.stock >= quantity) {
      product.stock -= quantity;
      await product.save();
    } else {
      console.log("Not enough stock");
    }

    //make changes to cart

    if (user.cart.some((item) => item.productId.toString() === req.params.id)) {
      let updatedQuantity =
        parseInt(req.body.quantity) +
        parseInt(
          user.cart.find((item) => item.productId.toString() == req.params.id)
            .productQuantity
        );

      await User.findByIdAndUpdate(
        req.user,
        { $set: { "cart.$[elem].productQuantity": parseInt(updatedQuantity) } },
        { arrayFilters: [{ "elem.productId": req.params.id }], new: true }
      );
    } else {
      user.cart.push({
        productId: req.params.id,
        productName: product.name,
        productQuantity: quantity,
      });
      await user.save();
    }

    const products = await Product.find({});
    res.render("products/index", { products: products });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

module.exports = router;
