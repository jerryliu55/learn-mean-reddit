var express = require("express");
var bodyParser = require("body-parser");
var mongo = require("mongodb");

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var MongoClient = mongo.MongoClient;
var mongoURL = "mongodb://localhost:27017/reddit";
var db = null;

MongoClient.connect(mongoURL, function(err, _db) {
  if (err) {
    console.log(err);
    throw err;
  } else {
    console.log("connected to mongodb at " + mongoURL);
    db = _db;
  }
});

app.get("/", function(req, res) {
  res.json({"message": "hello world!"});
});

app.get("/hi", function(req, res) {
  res.send("Hi");
});

app.post("/api/posts", function(req, res) {
  if ("user" in req.body && "title" in req.body) {
    console.log("has user and title");
    res.json({"response": "all good"});
  } else {
    res.json({"response": "missing field"});
  }
  // db.collection("posts").insertOne({
  //   "user": req.body.user,
  //   "title": req.body.title
  // });
});

app.listen(3000, function() {
  console.log("reddit clone listening on port 3000");
});
