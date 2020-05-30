const express = require('express')
const ObjectID = require('mongoose').Types.ObjectId
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const auth = require('../../middleware/token-auth')
const { commentActivity } = require('../../utils/activity')
const { check, validationResult } = require('express-validator')

const router = express.Router()

/**
 * @route : GET api/post/
 * @desc : Get all posts from following sorted by date
 * @access : Private
 */
router.get('/', auth, async (req, res) => {
  const userID = req.user.id
  const limit = 50
  const lastPostID = req.query.postID

  try {
    const profile = await Profile.findOne({ user: userID })

    if (!profile)
      return res.status(400).json({
        notFound: true,
        msg: 'Create your profile to see what other people share.'
      })

    if (profile.following.length == 0) return res.json([])

    let posts

    if (lastPostID === '')
      posts = await Post.find({
        user: { $in: profile.following.map(({ user }) => user) }
      })
        .limit(limit)
        .populate('profile')
        .populate('comments.profile')
        .populate('likes.profile')
        .sort('-date')
    else
      posts = await Post.find({
        $and: [
          { user: { $in: profile.following.map(({ user }) => user) } },
          { _id: { $lt: lastPostID } }
        ]
      })
        .limit(limit)
        .populate('profile')
        .populate('comments.profile')
        .populate('likes.profile')
        .sort('-date')

    res.json(posts)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Something Went Wrong! Please Try Again!')
  }
})

/**
 * @route : GET api/post/new
 * @desc : Check for new posts from following sorted by date
 * @access : Private
 */
router.get('/new', auth, async (req, res) => {
  const userID = req.user.id
  const limit = 50
  const firstPostID = req.query.postID

  try {
    const profile = await Profile.findOne({ user: userID })

    if (!profile)
      return res.status(400).json({
        notFound: true,
        msg: 'Create your profile to see what other people share.'
      })

    if (profile.following.length == 0) return res.json([])

    const posts = await Post.find({
      $and: [
        { user: { $in: profile.following.map(({ user }) => user) } },
        { _id: { $gt: firstPostID } }
      ]
    })
      .limit(limit)
      .populate('profile')
      .populate('comments.profile')
      .populate('likes.profile')
      .sort('-date')

    res.json(posts)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Something Went Wrong! Please Try Again!')
  }
})

/**
 * @route : GET api/post/me
 * @desc : Get current user post
 * @access : Private
 */
router.get('/me', auth, async (req, res) => {
  const id = req.user.id
  try {
    const posts = await Post.find({ user: id })
      .populate('profile')
      .populate('comments.profile')
      .populate('likes.profile')
      .sort('-date')
    res.json(posts)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Something Went Wrong! Please Try Again!')
  }
})

/**
 * @route : GET api/post/user/:id
 * @desc : Get All Posts from another User
 * @access : Private
 */
router.get('/user/:id', auth, async (req, res) => {
  const id = req.params.id

  if (!ObjectID.isValid(id) || new ObjectID(id) != id) return res.json([])

  try {
    const posts = await Post.find({ user: id })
      .populate('profile')
      .populate('comments.profile')
      .populate('likes.profile')
      .sort('-date')
    res.json(posts)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Something Went Wrong! Please Try Again!')
  }
})

/**
 * @route : POST api/post
 * @desc : Create a post
 * @access : Private
 */
router.post(
  '/',
  [
    auth,
    [check('content').not().isEmpty().withMessage('Content cannot be empty')]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({
        validation: true,
        errors: errors.array({ onlyFirstError: true })
      })

    try {
      const profile = await Profile.findOne({ user: req.user.id })
      if (!profile)
        return res.status(400).json({
          notFound: true,
          msg: 'Create your profile in order to post.'
        })

      const post = new Post({
        user: req.user.id,
        profile: profile._id,
        content: req.body.content
      })
      await post.save()
      await post
        .populate('profile')
        .populate('comments.profile')
        .populate('likes.profile')
        .execPopulate()

      res.json(post)
    } catch (err) {
      console.log(err.message)
      res.status(500).send('Something Went Wrong! Please Try Again!')
    }
  }
)

/**
 * @route : GET api/post/:post
 * @desc : Get a Post
 * @access : Private
 */
router.get('/:id', auth, async (req, res) => {
  const postID = req.params.id

  if (!ObjectID.isValid(postID) || new ObjectID(postID) != postID)
    return res.status(400).json({
      notFound: true,
      msg: 'Post Not Found'
    })

  try {
    const post = await Post.findById(postID)
      .populate('profile')
      .populate('comments.profile')
      .populate('likes.profile')
    if (!post)
      return res.status(400).json({
        notFound: true,
        msg: 'Post Not Found'
      })

    res.json(post)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Something Went Wrong! Please Try Again!')
  }
})

/**
 * @route : PUT api/post/:post
 * @desc : Edit a Post
 * @access : Private
 */
router.put(
  '/:post',
  [
    auth,
    [check('content').not().isEmpty().withMessage('Content cannot be empty')]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({
        validation: true,
        errors: errors.array({ onlyFirstError: true })
      })

    try {
      const postID = req.params.post

      if (!ObjectID.isValid(postID) || new ObjectID(postID) != postID)
        return res.status(404).json({ notFound: true, msg: 'Post not found' })

      const post = await Post.findById(postID)

      if (!post)
        return res.status(404).json({ notFound: true, msg: 'Post not found' })

      post.content = req.body.content
      await post.save()
      await post
        .populate('profile')
        .populate('comments.profile')
        .populate('likes.profile')
        .execPopulate()

      return res.json(post)
    } catch (err) {
      console.log(err.message)
      res.status(500).send('Something Went Wrong! Please Try Again!')
    }
  }
)

/**
 * @route : DELETE api/post/:post
 * @desc : Delete a post
 * @access : Private
 */
router.delete('/:post', auth, async (req, res) => {
  const postID = req.params.post

  if (!ObjectID.isValid(postID) || new ObjectID(postID) != postID)
    return res.status(404).json({ notFound: true, msg: 'Post not found' })

  try {
    const post = await Post.findByIdAndDelete(postID)

    if (!post)
      return res.status(404).json({ notFound: true, msg: 'Post not found' })

    res.json({ msg: 'Post deleted successfully' })
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Something Went Wrong! Please Try Again!')
  }
})

/**
 * @route : PUT /api/post/like/:post
 * @desc : Like and Unlike a post
 * @access : Private
 */
router.put('/like/:post', auth, async (req, res) => {
  const id = req.user.id
  const postID = req.params.post

  if (!ObjectID.isValid(postID) || new ObjectID(postID) != postID)
    return res.status(404).json({
      notFound: true,
      msg: 'Post not found'
    })

  try {
    const profile = await Profile.findOne({ user: id })

    if (!profile)
      return res.status(400).json({
        notFound: true,
        msg: 'Create your profile before liking a post'
      })

    const post = await Post.findById(postID)

    if (!post)
      return res.status(404).json({
        notFound: true,
        msg: 'Post not found'
      })

    if (post.likes.some((like) => like.user == id)) {
      post.likes = post.likes.filter((like) => like.user != id)
      await post.save()
      await post
        .populate('profile')
        .populate('comments.profile')
        .populate('likes.profile')
        .execPopulate()

      return res.json(post)
    }

    post.likes.push({ user: id, profile: profile.id, date: new Date() })
    await post.save()
    await post
      .populate('profile')
      .populate('comments.profile')
      .populate('likes.profile')
      .execPopulate()

    res.json(post)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Something Went Wrong! Please Try Again!')
  }
})

/**
 * @route : PUT api/post/comment/:post
 * @desc: Comment on a post
 * @access: Private
 */
router.put(
  '/comment/:post',
  [
    auth,
    [check('comment').not().isEmpty().withMessage('Comment cannot be empty')]
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty())
      return res.status(400).json({ validation: true, errors: errors.array() })

    const id = req.user.id
    const postID = req.params.post
    const comment = req.body.comment

    if (!ObjectID.isValid(postID) || new ObjectID(postID) != postID)
      return res.status(404).json({
        notFound: true,
        msg: 'Post not found'
      })

    try {
      const profile = await Profile.findOne({ user: id })

      if (!profile)
        return res.status(400).json({
          notFound: true,
          msg: 'Create your profile before commenting on a post'
        })

      const post = await Post.findById(postID)

      if (!post)
        return res.status(404).json({
          notFound: true,
          msg: 'Post not found'
        })

      post.comments.push({
        user: id,
        profile: profile.id,
        comment,
        date: new Date()
      })

      await post.save()
      await post
        .populate('profile')
        .populate('comments.profile')
        .populate('likes.profile')
        .execPopulate()

      const activity = await commentActivity(post, profile)

      res.json({ post, activity })
    } catch (err) {
      console.log(err.message)
      res.status(500).send('Something Went Wrong! Please Try Again!')
    }
  }
)

/**
 * @route : DELETE api/post/comment/:comment
 * @desc : Delete Comment on a post
 * @access : Private
 */
router.delete('/comment/:comment', auth, async (req, res) => {
  const id = req.user.id
  const commentID = req.params.comment

  if (!ObjectID.isValid(commentID) || new ObjectID(commentID) != commentID)
    return res.status(404).json({
      notFound: true,
      msg: 'Comment not found'
    })

  try {
    const profile = await Profile.findOne({ user: id })

    if (!profile)
      return res.status(400).json({
        notFound: true,
        msg: 'Comment not found'
      })

    const post = await Post.findOne({ 'comments._id': commentID })

    if (!post)
      return res.status(404).json({
        notFound: true,
        msg: 'Comment not found'
      })

    post.comments = post.comments.filter((comment) => comment._id != commentID)

    await post.save()
    await post
      .populate('profile')
      .populate('comments.profile')
      .populate('likes.profile')
      .execPopulate()

    res.json(post)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Something Went Wrong! Please Try Again!')
  }
})

module.exports = router
