if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));

const indexRouter = require("./routes/index");
const productsRouter = require("./routes/products");
app.use("/", indexRouter);
app.use("/products", productsRouter);

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {});
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to MongoDB"));

app.listen(process.env.PORT || 3000);
