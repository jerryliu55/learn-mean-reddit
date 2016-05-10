var express = require("express");
var router = express.Router();

var user = require("../models/user");
var post = require("../models/post");

user.methods(["get", "put", "post", "delete"]);
user.register(router, "/users");

post.methods(["get", "put", "post", "delete"]);
post.register(router, "/posts");

module.exports = router;
