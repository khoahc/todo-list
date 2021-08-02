const express = require("express");
const date = require(__dirname + "/date");
const app = express();

const port = process.env.PORT || 3000;
const ITEMS = ["Buy Food", "Cook Food", "Eat Food"];
const WORK_ITEMS = [];
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  const day = date.getDate();
  res.render("list", { listTitle: day, newListItems: ITEMS });
});

app.post("/", function (req, res) {
  const item = req.body.newItem;
  if (req.body.list === "Work") {
    WORK_ITEMS.push(item);
    res.redirect("/work");
  } else {
    ITEMS.push(item);
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: WORK_ITEMS });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(port, function () {
  console.log("3000");
});
