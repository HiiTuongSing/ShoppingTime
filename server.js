if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const FilePond = require("filepond");
const FilePondPluginImagePreview = require("filepond-plugin-image-preview");
const FilePondPluginFileEncode = require("filepond-plugin-file-encode");
const FilePondPluginImageResize = require("filepond-plugin-image-resize");

const pond = FilePond.create({
  multiple: true,
  name: "filepond",
});

FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginImageResize
);

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(methodOverride("_method"));

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
