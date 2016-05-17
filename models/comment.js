var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
  user_id: {type: String, required: true},
  date_created: {type: Date, default: Date.now},
  body: {type: String, required: true, defualt: ""},
  upvotes: {type: Number, default: 1},
  downvotes: {type: Number, default: 0}
});

commentSchema.add({
  comments: [commentSchema]
});

module.exports = mongoose.model("Comment", commentSchema);
