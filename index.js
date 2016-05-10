var express = require("express");
var bodyParser = require("body-parser");
// var mongo = require("mongodb");
var mongoose = require("mongoose");
var user = require("./models/user");

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// var MongoClient = mongo.MongoClient;
// var mongoURL = "mongodb://localhost:27017/reddit";
var db = null;

// MongoClient.connect(mongoURL, function(err, _db) {
mongoose.connect(mongoURL, function(err, db) {
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

app.get("/api/posts", function(req, res) {
  db.collection("posts").find().toArray(function(err, posts) {
    if (err) {
      res.status(404);
      res.json({"response": "error getting all posts"});
    } else {
      res.status(200);
      res.json(posts);
    }
  });
});

app.post("/api/posts", function(req, res) {
  if ("user" in req.body && "title" in req.body) {
    db.collection("posts").insertOne({
      "user": req.body.user,
      "title": req.body.title,
      "body": req.body.body,
      "link": req.body.link
    }, function(err, docsInserted) {
      // console.log(docsInserted.insertedId);
      // // add link if exists
      // if ("link" in req.body) {
      //   db.collection("posts").update({_id: docsInserted.insertedId}, {"link": req.body.link});
      // }
      if (err) {
        res.status(400);
      } else {
        res.status();
      }
    });

    res.json({"response": "all good"});
  } else {
    res.status(400);
    res.json({"response": "missing field"});
  }
});

app.listen(3000, function() {
  console.log("reddit clone listening on port 3000");
});
