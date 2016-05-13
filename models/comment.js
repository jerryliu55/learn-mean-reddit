var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
  user: {type: String, required: true},
  date_created: {type: Date, default: Date.now},
  body: {type: String, required: true, defualt: ""}
});

commentSchema.add({
  comments: [commentSchema]
});

module.exports = mongoose.model("Comment", commentSchema);
