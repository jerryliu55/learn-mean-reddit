var express = require("express");
var app = express();

var mongo = require("mongodb");
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

app.listen(3000, function() {
  console.log("reddit clone listening on port 3000");
});
