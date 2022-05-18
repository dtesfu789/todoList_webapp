const express = require("express");
const bodyParser = require("body-parser");
const myDate = require(__dirname+'/date.js');
const app = express();
const port = 3000;

let day = "";
let taskInput = "";
let taskList = ['task 01', 'task 02', 'task 03'];
let workList = [];
let houseWorkList = [];


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.get("/", function(req, res) {
  let today = myDate.getDay();
  res.render('list', {
    ListTitle: today,
    UserTaskInput: taskList
  });
});
app.post("/", function(req, res) {
  taskInput = req.body.task;
  if (req.body.submit === "Work") {
    workList.push(taskInput);
    res.redirect("/work");
  } else if (req.body.submit === "House Work") {
    houseWorkList.push(taskInput);
    res.redirect("/house_work")
  } else {
    taskList.push(taskInput);
    res.redirect("/");
  }


});
app.get("/work", function(req, res) {
  res.render('list', {
    ListTitle: "Work",
    UserTaskInput: workList
  });
})
app.get("/house_work", function(req, res) {
  res.render('list', {
    ListTitle: "House Work",
    UserTaskInput: houseWorkList
  })
});

app.get("/about", function(req, res) {
  res.render('about');
});

app.listen(port, function() {
  console.log("server started at port 3000");
});
