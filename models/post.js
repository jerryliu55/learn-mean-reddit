var restful = require("node-restful");
var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
  title: {type: String, required: true},
  user: {type: String, required: true},
  body: {type: String, default: ""},
  link: {type: String, default: ""},
  upvotes: {type: Number, default: 1},
  downvotes: {type: Number, default: 0},
  comments: {type: String} // update this
});

module.exports = restful.model("Post", postSchema);
