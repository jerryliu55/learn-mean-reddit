var express = require("express");
var router = express.Router();

// models
var Post = require("../models/post");
var User = require("../models/user");
var Comment = require("../models/comment");

// router
router.use(function(req, res, next) {
  console.log("router initialized with function");
  next();
});

router.get("/", function(req, res) {
  res.json({"response": "test works"});
});

// Routes for posts endpoint
router.route("/posts")
  .post(function(req, res) {
    var post = new Post();
    post.title = req.body.title;
    post.user = req.body.user;
    post.body = req.body.body;
    post.link = req.body.link;

    post.save(function(err) {
      if (err) {
        console.log("error: " + err);
        res.status(500);
        res.json({"created": "false"});
      } else {
        res.status(201);
        res.json({"acknowledged": true});
      }
    });
  })
  .get(function(req, res) {
    Post.find(function(err, posts) {
      if (err) {
        console.log("error: " + err);
        res.status(404);
        res.json({"response": "error getting posts"});
      } else {
        res.status(200);
        res.json(posts);
      }
    });
  });

router.route("/posts/:post_id")
  .get(function(req, res) {
    Post.findById(req.params.post_id, function(err, post) {
      if (err || (post === null)) {
        console.log("error: " + err);
        res.status(404);
        res.json({"response": "error getting post with id: " + req.params.post_id});
      } else {
        res.status(200);
        res.json(post);
      }
    });
  })
  .delete(function(req, res) {
    Post.remove({
      _id : req.params.post_id
    }, function(err) {
      if (err) {
        console.log("error: " + err);
        res.status(404);
        res.json({"response": "error deleting post with id: " + req.params.post_id});
      } else {
        res.status(200);
        res.json({"deleted": true});
      }
    });
  });

// Routes for users endpoint
router.route("/users")
  .post(function(req, res) {
    var user = new User();
    user.name = req.body.name;
    user.password = req.body.password; // of course this will need a more secure implementation

    user.save(function(err) {
      if (err) {
        console.log("error: " + err);
        res.status(500);
        res.json({"created": false});
      } else {
        res.status(201);
        res.json({"acknowledged": true});
      }
    });
  })
  .get(function(req, res) {
    User.find(function(err, users) {
      if (err) {
        console.log("error: " + err);
        res.status(404);
        res.json({"retrieved": false});
      } else {
        res.json(users);
      }
    });
  });

router.route("/users/:user_id")
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err || (user === null)) {
        console.log("error: " + err);
        res.status(404);
        res.json({"response": "error getting user with id: " + req.params.user_id});
      } else {
        res.status(200);
        res.json(user);
      }
    });
  })
  .delete(function(req, res) {
    User.remove({
      _id : req.params.user_id
    }, function(err) {
      if (err) {
        console.log("error: " + err);
        res.status(404);
        res.json({"response": "error deleting user with id: " + req.params.post_id});
      } else {
        res.status(200);
        res.json({"deleted": true});
      }
    });
  });

module.exports = router;