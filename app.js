const express = require("express");
const date = require(__dirname + "/date");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect(
  "mongodb+srv://admin-khoa:hacker2001@cluster0.kbggj.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const itemsSchema = {
  name: String,
};

const listSchema = {
  listName: String,
  items: [itemsSchema],
};

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({ name: "Welcome todolist!" });
const item2 = new Item({ name: "Hit the + button to aff a new item." });
const item3 = new Item({ name: "<-- Hit this to delete an item. " });

const defaultItems = [item1, item2, item3];

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/", function (req, res) {
  // const day = date.getDate();
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully inserted default items");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ listName: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //Create a new list
        const list = new List({
          listName: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an exiting list
        res.render("list", {
          listTitle: foundList.listName,
          newListItems: foundList.items,
        });
      }
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const newItem = new Item({ name: itemName });

  if (listName === "Today") {
    newItem.save().then(() => console.log("inserted new item"));
    res.redirect("/");
  } else {
    List.findOne({ listName: listName }, function (err, foundList) {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", (req, res) => {
  let checkedItemId = req.body.checkbox;
  checkedItemId = checkedItemId.substring(0, checkedItemId.length - 1);
  const listName = req.body.listName;
  // because checkedItemId has an extra space at the end
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted checked item ");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { listName: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.listen(port, function () {
  console.log("3000");
});
