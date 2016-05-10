var restful = require("node-restful");
var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  name: {type: String, unique: true, required: true},
  date_created: {type: Date, default: Date.now},
  password: {type: String, required: true}
});

module.exports = restful.model("User", userSchema);
