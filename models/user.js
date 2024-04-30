const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  cart: [
    {
      productId: {
        type: String,
      },
      productName: {
        type: String,
      },
      productQuantity: {
        type: Number,
        default: 0,
      },
      price: {
        type: Number,
        default: 0,
      },
      totalPrice: {
        type: Number,
        default: 0,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
