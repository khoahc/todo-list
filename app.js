const express = require("express");
const date = require(__dirname + "/date");
const mongoose = require("mongoose");
const app = express();

const port = process.env.PORT || 3000;
// const ITEMS = ["Buy Food", "Cook Food", "Eat Food"];

const WORK_ITEMS = [];
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({ name: "Welcome todolist!" });
const item2 = new Item({ name: "Hit the + button to aff a new item." });
const item3 = new Item({ name: "<-- Hit this to delete an item. " });

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
  // const day = date.getDate();
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully inserted");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "To day", newListItems: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  // const item = req.body.newItem;
  // if (req.body.list === "Work") {
  //   WORK_ITEMS.push(item);
  //   res.redirect("/work");
  // } else {
  //   ITEMS.push(item);
  //   res.redirect("/");
  // }

  const itemName = req.body.newItem;
  const newItem = new Item({ name: itemName });
  newItem.save().then(() => console.log("inserted new item"));
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  let checkedItemId = req.body.checkbox;
  // because checkedItemId has an extra space at the end
  checkedItemId = checkedItemId.substring(0, checkedItemId.length - 1);
  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully deleted checked item ");
      res.redirect("/");
    }
  });
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
