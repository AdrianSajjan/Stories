const express = require("express");
const router = express.Router();
const ObjectID = require("mongoose").Types.ObjectId;
const { check, validationResult } = require("express-validator");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const Follow = require("../../models/Follow");
const auth = require("../../middleware/token-auth");
const { VALIDATION, SERVER, NOTFOUND } = require("../../config/errors");

//@type: GET
//@desc: Get all posts from following sorted by date
//@access: Private
router.get("/", auth, async (req, res) => {
  const userID = req.user.id;
  const posts = [];

  try {
    const follow = await Follow.findOne({ user: userID });

    if (!follow || follow.following.length == 0)
      return res.json({
        msg: "No posts found. Start following People to see their posts.",
      });

    const following = follow.following;

    following.forEach(async ({ user }) => {
      const _posts = await Post.find({ user })
        .populate("profile", "username")
        .sort("-date");
      if (_posts.length) posts.push(_posts);
    });

    res.send({ posts });
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
    const posts = await Post.find({ user: id }).populate("profile", "username");
    if (!posts.length) return res.json({ msg: "No Posts Found" });
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
    const posts = await Post.find({ user: id }).populate("profile", "username");
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
      await post.save();
      res.send({ msg: "Post Created!" });
    } catch (err) {
      console.log(err.message);
      res.status(500).send(SERVER);
    }
  }
);

module.exports = router;
