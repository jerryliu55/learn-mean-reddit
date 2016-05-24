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
    post.user_id = req.body.user_id;
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
      if (err) {
        console.log("error: " + err);
        res.status(500);
        res.json({"response": "error retrieving"});
      } else if (post === null) {
        res.status(404);
        res.json({"response": "post not found"});
      } else {
        res.status(200);
        res.json(post);
      }
    });
  })
  .delete(function(req, res) {
    Post.remove({
      _id : req.params.post_id
    }, function(err, removed) {
      if (err) {
        console.log("error: " + err);
        res.status(500);
        res.json({"response": "error deleting"});
      } else if (removed.result.n === 0) {
        res.status(404);
        res.json({"response": "post not found"});
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

    // check if username exists
    User.find({"name": req.body.name}, function(err, _user) {
      if (_user === null) {
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
      } else {
        console.log("error: " + err);
        res.status(500);
        res.json({"error": "username already exists"});
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
        res.status(500);
        res.json({"response": "error retrieving"});
      } else if (user === null) {
        res.status(404);
        res.json({"response": "user not found"});
      } else {
        res.status(200);
        res.json(user);
      }
    });
  })
  .delete(function(req, res) {
    User.remove({
      _id : req.params.user_id
    }, function(err, removed) {
      if (err) {
        console.log("error: " + err);
        res.status(500);
        res.json({"response": "error deleting"});
      } else if (removed.result.n === 0) {
        res.status(404);
        res.json({"response": "user not found"});
      } else {
        res.status(200);
        res.json({"deleted": true});
      }
    });
  });

router.route("/users/:user_id/posts")
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      console.log(user);
      if (err) {
        console.log("error: " + err);
        res.status(500);
        res.json({"response": "error finding user"});
      } else if (user === null) {
        console.log("error: not found");
        res.status(404);
        res.json({"response": "user not found"});
      }
    });
    Post.find({user_id: req.params.user_id}, function(err, posts) {
      if (err) {
        console.log("error " + err);
        res.status(500);
        res.json({"response": "error getting posts for user"});
      } else {
        res.status(200);
        res.json(posts);
      }
    });
  });

// Routes for just comments
router.route("/comments")
  .get(function(req, res) {
    Comment.find(function(err, comments) {
      if (err) {
        console.log("error: " + err);
        res.status(404);
        res.json({"retrieved": false});
      } else {
        res.json(comments);
      }
    });
  });

router.route("/comments/:comment_id/comments")
  .get(function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err) {
        console.log("error: " + err);
        res.status(404);
        res.json({"retrieved": false});
      } else {
        Comment.find({'_id': {$in: comment.comments}}, function(err, comments) {
          if (err) {
            console.log("error: " + err);
            res.status(500).json({"error": "error getting comments of post"});
          } else {
            res.status(200).json(comments);
          }
        });
      }
    });
  })
  .post(function(req, res) {
    var comment = new Comment();
    comment.user_id = req.body.user_id;
    comment.body = req.body.body;

    // add comment to comments db
    comment.save(function(err, model) {
      if (err) {
        console.log("error: " + err);
        res.status(500);
        res.json({"created": false});
      } else {
        // add comment to the post
        Comment.findByIdAndUpdate(
          req.params.comment_id,
          {$push: {comments: model._id}},
          {safe: true, upsert: true},
          function(err, model) {
            // error checking
            if (err) {
              console.log("error posting comment to comment: " + err);
              res.status(500);
              res.json({"response": "error posting comment"});
            } else {
              // no errors
              res.status(201).json({"acknowledged": "true"});
            }
          });
      }
    });
  });

// Routes for comments to a post
router.route("/posts/:post_id/comments")
  .get(function(req, res) {
    Post.findById(req.params.post_id, function(err, post) {
      // error checking
      if (err) {
        console.log("error: " + err);
        res.status(500);
        res.json({"response": "error retrieving post"});
      } else if (post === null) {
        res.status(404);
        res.json({"response": "post not found"});
      } else {
        Comment.find({'_id': {$in: post.comments}}, function(err, comments) {
          if (err) {
            console.log("error: " + err);
            res.status(500).json({"error": "error getting comments of post"});
          } else {
            res.status(200).json(comments);
          }
        });
      }
    });
  })
  .post(function(req, res) {
    var comment = new Comment();
    comment.user_id = req.body.user_id;
    comment.body = req.body.body;

    // add comment to comments db
    comment.save(function(err, model) {
      if (err) {
        console.log("error: " + err);
        res.status(500);
        res.json({"created": "false"});
      } else {
        // add comment to the post
        Post.findByIdAndUpdate(
          req.params.post_id,
          {$push: {comments: model._id}},
          {safe: true, upsert: true},
          function(err, model) {
            // error checking
            if (err) {
              console.log("error posting comment: " + err);
              res.status(500);
              res.json({"response": "error posting comment"});
            } else {
              // no errors
              res.json({"acknowledged": true});
            }
          });
      }
    });
  });

module.exports = router;
