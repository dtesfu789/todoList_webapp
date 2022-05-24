const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://admin-dereje:wishDB@cluster0.6enrmrf.mongodb.net/todoeyDB');
const TodoeySchema = new mongoose.Schema({
  name: String
});
const Task = mongoose.model("Task", TodoeySchema);
const task01 = new Task({
  name: 'Welcome to your Todoey List!'
});
const task02 = new Task({
  name: 'Hit the + button to add a new item.'
});
const task03 = new Task({
  name: '<-- Hit this to delete an item.'
});

let taskList = [task01, task02, task03];

const ListSchema = new mongoose.Schema({
  name: String,
  items: [TodoeySchema]
});
const List = mongoose.model("List", ListSchema);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.get("/", function(req, res) {
  Task.find({}, function(err, docs) {
    if (docs.length === 0) {
      Task.insertMany(taskList, function(err) {
        if (err) {
          console.log(err);
        };
      });

      res.redirect("/");
    } else {
      res.render('list', {
        ListTitle: "Today",
        UserTaskInput: docs
      });
    }
  });

});

app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(Object.values(req.params)[0]);
  const list = new List({
    name: customListName,
    items: taskList
  });
  List.findOne({
    name: customListName
  }, function(err, docs) {
    if (!err) {
      if (!docs) {
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render('list', {
          ListTitle: docs.name,
          UserTaskInput: docs.items
        })
      }
    }
  });
});

app.post("/", function(req, res) {
  customListName = req.body.submit;
  const taskInput = new Task({
    name: req.body.task
  });
  if (req.body.submit === "Today") {
    taskInput.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: customListName
    }, function(err, docs) {
      docs.items.push(taskInput);
      docs.save();
      res.redirect("/" + customListName);
    });
  }
});

app.post("/delete", function(req, res) {
  const checkedBoxName = Object.keys(req.body);
  const checkedBoxValue = Object.values(req.body)[0];
  const pageIdentifier = checkedBoxName[0].split("_")[0];
  const dtbID = checkedBoxName[0].split("_")[1];
  if (checkedBoxValue === "on") {
    if (pageIdentifier === "Today") {
      Task.findByIdAndRemove(dtbID, function(err) {
        console.log(err);
      });
      res.redirect("/");
    } else {

      List.findOneAndUpdate({
        name: pageIdentifier
      }, {
        $pull: {
          items: {
            _id: dtbID
          }
        }
      }, function(err, docs) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/" + pageIdentifier);
        }
      });

    }
  }
});


app.listen(port, function() {
  console.log("server started at port 3000");
});
