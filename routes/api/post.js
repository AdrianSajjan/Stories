const express = require("express");
const router = express.Router();
const ObjectID = require("mongoose").Types.ObjectId;
const { check, validationResult } = require("express-validator");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const auth = require("../../middleware/token-auth");
const { VALIDATION, SERVER, NOTFOUND } = require("../../config/errors");

//@type: GET
//@desc: Get all posts from following sorted by date
//@access: Private
router.get("/", auth, async (req, res) => {
  const userID = req.user.id;
  const posts = [];

  try {
    const profile = await Profile.findOne({ user: userID });

    if (!profile)
      return res.status(400).json({
        type: NOTFOUND,
        msg: "Create your profile to see what other people share.",
      });

    if (profile.following.length == 0)
      return res.status(401).json({
        type: NOTFOUND,
        msg: "Start following people to see their posts.",
      });

    profile.following.forEach(async ({ user }, index) => {
      const _posts = await Post.find({ user })
        .populate("profile", "username")
        .populate("comments.profile", "username")
        .populate("likes.profile", "username");
      if (_posts.length > 0) posts.push.apply(posts, _posts);
      if (index == profile.following.length - 1) {
        if (posts.length > 1)
          posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.send({ posts });
      }
    });
    // Handle Errors
  } catch (err) {
    console.log(err.message);
    res.status(500).send(SERVER);
  }
});

//@type: GET
//@desc: Get current user post
//@access: Private
router.get("/me", auth, async (req, res) => {
  // Get Current User ID
  const id = req.user.id;
  try {
    const profile = await Profile.findOne({ user: id });
    if (!profile)
      return res.status(400).json({
        type: NOTFOUND,
        msg:
          "Create your profile in order to start posting and view your posts.",
      });
    const posts = await Post.find({ user: id })
      .populate("profile", "username")
      .populate("comments.profile", "username")
      .populate("likes.profile", "username")
      .sort("-date");
    if (posts.length == 0)
      return res.json({ type: NOTFOUND, msg: "No Posts Found" });
    res.json({ posts });
  } catch (err) {
    console.log(err.message);
    res.status(500).send(SERVER);
  }
});

//@type: GET
//@desc: Get All Posts from another User
//@access: Private
router.get("/user/:id", auth, async (req, res) => {
  // Get Current User ID
  const id = req.params.id;
  if (!ObjectID.isValid(id) || new ObjectID(id) != id)
    return res.json({ type: NOTFOUND, msg: "No Posts Found" });

  try {
    const posts = await Post.find({ user: id })
      .populate("profile", "username")
      .populate("comments.profile", "username")
      .populate("likes.profile", "username")
      .sort("-date");
    if (!posts.length) return res.json({ msg: "No Posts Found" });
    res.json({ posts });
  } catch (err) {
    console.log(err.message);
    res.status(500).send(SERVER);
  }
});

//@type: Post
//@desc: Post a post :)
//@access: Private
router.post(
  "/",
  [
    auth,
    [check("content").not().isEmpty().withMessage("Content cannot be empty")],
  ],
  async (req, res) => {
    // Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        type: VALIDATION,
        errors: errors.array({ onlyFirstError: true }),
      });
    // Save a Post to database
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile)
        return res.status(400).json({
          type: NOTFOUND,
          msg: "Create your profile in order to post.",
        });
      const post = new Post({
        user: req.user.id,
        profile: profile._id,
        content: req.body.content,
      });
      await post.save();
      res.send({ msg: "Post Created!", post: post });
    } catch (err) {
      console.log(err.message);
      res.status(500).send(SERVER);
    }
  }
);

//@type: Put
//@desc: Like and Unlike a post :)
//@access: Private
router.put("/like/:post", auth, async (req, res) => {
  const id = req.user.id;
  const postID = req.params.post;
  if (!ObjectID.isValid(postID) || new ObjectID(postID) != postID)
    return res.status(404).json({
      type: NOTFOUND,
      msg: "Post not found",
    });
  try {
    const profile = await Profile.findOne({ user: id });
    if (!profile)
      return res.status(400).json({
        type: NOTFOUND,
        msg: "Create your profile before liking a post",
      });
    const post = await Post.findById(postID);
    if (!post)
      return res.status(404).json({
        type: NOTFOUND,
        msg: "Post not found",
      });
    if (post.likes.some((like) => like.user == id)) {
      post.likes = post.likes.filter((like) => like.user != id);
      await post.save();
      return res.json({ msg: "unliked", likes: post.likes });
    }
    post.likes.push({ user: id, profile: profile.id, date: new Date() });
    await post.save();
    res.json({ msg: "liked", likes: post.likes });
  } catch (err) {
    console.log(err.message);
    res.status(500).send(SERVER);
  }
});

module.exports = router;
