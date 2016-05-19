var mongoose = require("mongoose");
var Comment = require("./comment").schema;

var postSchema = new mongoose.Schema({
  title: {type: String, required: true, default: ""},
  user_id: {type: String, required: true, default: "joeshmoe"},
  body: {type: String, default: ""},
  link: {type: String, default: ""},
  upvotes: {type: Number, default: 1},
  downvotes: {type: Number, default: 0},
  comments: {type: [Comment], default: []},
  date_created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Post", postSchema);
