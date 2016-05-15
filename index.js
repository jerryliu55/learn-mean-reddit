var express = require("express");
var bodyParser = require("body-parser");
// var mongo = require("mongodb");
var mongoose = require("mongoose");
var router = require("./routes/router");


// var MongoClient = mongo.MongoClient;
var mongoURL = "mongodb://localhost:27017/reddit";
var db = null;



// initialization
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



// MongoClient.connect(mongoURL, function(err, _db) { //// OLD
mongoose.connect(mongoURL, function(err, _db) { //// NEW
  if (err) {
    console.log(err);
    throw err;
  } else {
    console.log("connected to mongodb at " + mongoURL);
    db = _db;
  }
});




app.use("/api", router);

app.listen(3000, function() {
  console.log("reddit clone listening on port 3000");
});
