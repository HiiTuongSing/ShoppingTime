const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");

//show the user cart
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      console.log("User not found.");
      res.redirect("/");
      return;
    }

    const userCart = user.cart;
    res.render("carts/index", { userCart: userCart });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

//remove the whole product from the cart
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      console.log("User not found.");
      res.redirect("/");
      return;
    }

    const productToRemove = user.cart.find(
      (item) => item._id.toString() === req.params.id
    );

    if (!productToRemove) {
      console.log("Product not found in user's cart.");
      res.redirect("/");
      return;
    }

    const productId = productToRemove.productId;
    const productStock = productToRemove.productQuantity;

    const product = await Product.findById(productId);
    if (!product) {
      console.log("Product not found.");
      res.redirect("/");
      return;
    }

    product.stock += parseInt(productStock);
    await product.save();

    await User.findByIdAndUpdate(
      req.user,
      { $pull: { cart: { _id: req.params.id } } },
      { new: true }
    );

    const updatedUser = await User.findById(req.user);
    const updatedUserCart = updatedUser.cart;

    res.render("carts/index", { userCart: updatedUserCart });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

//increase or reduce product at the cart
router.get("/:id/edit", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log("Product not found in user's cart.");
      res.redirect("/");
      return;
    }
    res.render("carts/editCart", { product: product });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    let user = await User.findById(req.user);
    const quantity = req.body.quantity;

    //make changes to cart
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

    await user.save();

    //Make changes to product database
    product.stock -= quantity;
    await product.save();
    user = await User.findById(req.user);
    res.render("carts/index", { userCart: user.cart });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

module.exports = router;
