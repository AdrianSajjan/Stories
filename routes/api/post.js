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
      return res.json({
        msg: "Create your profile to see other user's posts.",
      });

    if (profile.following.length == 0)
      return res.json({
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
      return res.json({
        msg: "Create your profile to see other user's posts.",
      });
    const posts = await Post.find({ user: id })
      .populate("profile", "username")
      .populate("comments.profile", "username")
      .populate("likes.profile", "username")
      .sort("-date");
    if (posts.length == 0) return res.json({ msg: "No Posts Found" });
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
    return res.json({ msg: "No Posts Found" });

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
          msg: "Create your profile before posting!",
        });
      const post = new Post({
        user: req.user.id,
        profile: profile._id,
        content: req.body.content,
      });
      const _post = await post.save();
      res.send({ msg: "Post Created!", post: _post });
    } catch (err) {
      console.log(err.message);
      res.status(500).send(SERVER);
    }
  }
);

module.exports = router;
