const express = require("express");
const router = express.Router();
const ObjectID = require("mongoose").Types.ObjectId;
const { check, validationResult } = require("express-validator");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const auth = require("../../middleware/token-auth");
const { VALIDATION, SERVER, NOTFOUND } = require("../../config/errors");

/**
 * @route : GET api/post/
 * @desc : Get all posts from following sorted by date
 * @access : Private
 */
router.get("/", auth, async (req, res) => {
  const userID = req.user.id;
  const limit = 5;
  const page = parseInt(req.query.page) || 0;
  try {
    const profile = await Profile.findOne({ user: userID });

    if (!profile)
      return res.status(400).json({
        type: NOTFOUND,
        msg: "Create your profile to see what other people share.",
      });

    if (profile.following.length == 0) return res.json([]);

    const posts = await Post.find({
      user: { $in: profile.following.map(({ user }) => user) },
    })
      .populate("profile", "username")
      .populate("comments.profile", "username")
      .populate("likes.profile", "username")
      .sort("-date")
      .limit(limit)
      .skip(page * limit);
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(SERVER);
  }
});

/**
 * @route : GET api/post/me
 * @desc : Get current user post
 * @access : Private
 */
router.get("/me", auth, async (req, res) => {
  const id = req.user.id;
  try {
    const posts = await Post.find({ user: id })
      .populate("profile", "username")
      .populate("comments.profile", "username")
      .populate("likes.profile", "username")
      .sort("-date");
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(SERVER);
  }
});

/**
 * @route : GET api/post/user/:id
 * @desc : Get All Posts from another User
 * @access : Private
 */
router.get("/user/:id", auth, async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id) || new ObjectID(id) != id) return res.json([]);

  try {
    const posts = await Post.find({ user: id })
      .populate("profile", "username")
      .populate("comments.profile", "username")
      .populate("likes.profile", "username")
      .sort("-date");
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(SERVER);
  }
});

/**
 * @route : POST api/post
 * @desc : Create a post
 * @access : Private
 */
router.post(
  "/",
  [
    auth,
    [check("content").not().isEmpty().withMessage("Content cannot be empty")],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        type: VALIDATION,
        errors: errors.array({ onlyFirstError: true }),
      });

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
      await post
        .populate("profile", "username")
        .populate("comments.profile", "username")
        .populate("likes.profile", "username")
        .execPopulate();
      res.send(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).send(SERVER);
    }
  }
);

/**
 * @route : DELETE api/post/:post
 * @desc : Delete a post
 * @access : Private
 */
router.delete("/:post", auth, async (req, res) => {
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
        msg: "Post not found",
      });
    const post = await Post.findByIdAndDelete(postID);
    if (!post)
      return res.status(404).json({ type: NOTFOUND, msg: "Post not found" });
    res.json({ msg: "Post deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send(SERVER);
  }
});

/**
 * @route : PUT /api/post/like/:post
 * @desc : Like and Unlike a post
 * @access : Private
 */
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
      return res.json({ msg: "Unliked", likes: post });
    }

    post.likes.push({ user: id, profile: profile.id, date: new Date() });
    await post.save();
    res.json(post);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(SERVER);
  }
});

/**
 * @route : PUT api/post/comment/:post
 * @desc: Comment on a post
 * @access: Private
 */
router.put(
  "/comment/:post",
  [
    auth,
    [check("comment").not().isEmpty().withMessage("Comment cannot be empty")],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ type: VALIDATION, errors: errors.array() });

    const id = req.user.id;
    const postID = req.params.post;
    const comment = req.body.comment;

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
          msg: "Create your profile before commenting on a post",
        });

      const post = await Post.findById(postID);

      if (!post)
        return res.status(404).json({
          type: NOTFOUND,
          msg: "Post not found",
        });

      post.comments.push({
        user: id,
        profile: profile.id,
        comment,
        date: new Date(),
      });

      await post.save();
      res.json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).send(SERVER);
    }
  }
);

/**
 * @route : DELETE api/post/comment/:comment
 * @desc : Delete Comment on a post
 * @access : Private
 */
router.delete("/comment/:comment", auth, async (req, res) => {
  const id = req.user.id;
  const commentID = req.params.comment;
  if (!ObjectID.isValid(commentID) || new ObjectID(commentID) != commentID)
    return res.status(404).json({
      type: NOTFOUND,
      msg: "Comment not found",
    });
  try {
    const profile = await Profile.findOne({ user: id });
    if (!profile)
      return res.status(400).json({
        type: NOTFOUND,
        msg: "Comment not found",
      });
    const post = await Post.findOne({ "comments._id": commentID });
    if (!post)
      return res.status(404).json({
        type: NOTFOUND,
        msg: "Comment not found",
      });
    post.comments = post.comments.filter((comment) => comment._id != commentID);
    await post.save();
    res.json(post);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(SERVER);
  }
});

module.exports = router;
