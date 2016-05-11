var express = require("express");
var bodyParser = require("body-parser");
// var mongo = require("mongodb");
var mongoose = require("mongoose");
var user = require("./models/user");

// var MongoClient = mongo.MongoClient;
var mongoURL = "mongodb://localhost:27017/reddit";
var db = null;

// models
var Post = require("./models/post");
var User = require("./models/user");
var Comment = require("./models/comment");

// initialization
var router = express.Router();
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



// MongoClient.connect(mongoURL, function(err, _db) {
mongoose.connect(mongoURL, function(err, db) {
  if (err) {
    console.log(err);
    throw err;
  } else {
    console.log("connected to mongodb at " + mongoURL);
    // db = _db;
  }
});

// router
router.use(function(req, res, next) {
  console.log("router initialized with function");
  next();
});

router.get("/", function(req, res) {
  res.json({"response": "test works"});
});

router.route("/posts")
  .post(function(req, res) {
    var post = new Post();
    post.title = req.body.title;
    post.user = req.body.user;
    post.body = req.body.body;
    post.link = req.body.link;

    post.save(function(err) {
      if (err) {
        res.status(500);
        res.json({"response": "error saving post"});
      } else {
        res.status(201);
        res.json(post);
      }
    });
  });

app.use("/api", router);

app.listen(3000, function() {
  console.log("reddit clone listening on port 3000");
});
