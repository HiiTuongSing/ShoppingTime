if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(methodOverride("_method"));

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/cart");
const usersRouter = require("./routes/user");
app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/products", productsRouter);
app.use("/cart", cartsRouter);
app.use("/users", usersRouter);

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {});
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to MongoDB"));

app.listen(process.env.PORT || 3000);
