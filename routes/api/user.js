const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const { check, validationResult } = require('express-validator')
const { google } = require('googleapis')

const User = require('../../models/User')
const Profile = require('../../models/Profile')
const Post = require('../../models/Post')
const auth = require('../../middleware/token-auth')
const {
  VALIDATION,
  SERVER,
  NOTFOUND,
  AUTHENTICATION
} = require('../../config/errors')

require('dotenv').config()

const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'

const { OAuth2 } = google.auth
const router = express.Router()

const oauth2Client = new OAuth2(
  process.env.MAILING_SERVICE_CLIENT_ID,
  process.env.MAILING_SERVICE_CLIENT_SECRET,
  OAUTH_PLAYGROUND
)

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    clientId: process.env.MAILING_SERVICE_CLIENT_ID,
    clientSecret: process.env.MAILING_SERVICE_CLIENT_SECRET
  }
})

const encryptMail = async (payload, email) => {
  oauth2Client.setCredentials({
    refresh_token: process.env.MAILING_SERVICE_REFRESH_TOKEN
  })

  const accessToken = await oauth2Client.getAccessToken()

  const token = jwt.sign(payload, process.env.EMAIL_SECRET, { expiresIn: '1d' })
  const url = `https://stories-codex.herokuapp.com/verify/${token}`

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Confirm STORIES! Account',
    html: `Please click this link to confirm your email: <a href="${url}">Verify</a>`,
    auth: {
      user: process.env.MAIL_USER,
      refreshToken: process.env.MAILING_SERVICE_REFRESH_TOKEN,
      accessToken: accessToken.token
    }
  }

  return mailOptions
}

const sendMail = (mailOptions) => {
  return new Promise((resolve) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Coudn't send email")
        throw error
      }

      resolve()
    })
  })
}

/**
 * @route : POST api/user
 * @desc : Register an User
 * @access : Public
 */
router.post(
  '/',
  [
    check('name')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Name cannot be empty')
      .isLength({ min: 3 })
      .withMessage('Enter your full name')
      .matches(/^[A-Za-z\s]+$/)
      .withMessage('Name has invalid characters'),

    check('email')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Email cannot be empty')
      .isEmail()
      .withMessage('Enter a valid email')
      .custom(async (value) => {
        const user = await User.findOne({ email: value.trim() })
        if (user) throw new Error('Email already in use')
        return true
      }),

    check('password')
      .not()
      .isEmpty()
      .withMessage('Password cannot be empty')
      .isLength({ min: 6 })
      .withMessage('Password cannot be less than 6 letters'),

    check('confirmPassword')
      .not()
      .isEmpty()
      .withMessage('Password cannot be empty')
      .custom((value, { req }) => {
        if (value !== req.body.password)
          throw new Error("Passwords don't match")
        return true
      })
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty())
      return res.status(400).json({
        type: VALIDATION,
        errors: errors.array({ onlyFirstError: true })
      })

    try {
      const { name, email, password } = req.body
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)

      const user = new User({
        name: name.trim(),
        email: email.trim(),
        password: hash
      })

      const data = await user.save()

      const payload_ID = {
        user: {
          id: data.id
        }
      }

      const payload_EMAIL = {
        user: {
          email: data.email
        }
      }

      const mailOptions = await encryptMail(payload_EMAIL, data.email)

      sendMail(mailOptions).then(() => {
        console.log('Email sent successfully')
      })

      const access_token = jwt.sign(payload, process.env.ACCESS_SECRET, {
        expiresIn: '1h'
      })

      const refresh_token = jwt.sign(payload, process.env.REFRESH_SECRET, {
        expiresIn: '2d'
      })

      res.cookie('refresh_token', refresh_token, { maxAge: 172800000 })

      res.json({
        access_token,
        validated: data.validated,
        msg: `Verification mail sent to ${data.email}. It will expire in 1 day`
      })
    } catch (err) {
      console.log(err.message)
      res.status(500).send(SERVER)
    }
  }
)

/**
 * @route : POST api/user/update/name
 * @desc : Update User Name
 * @access : Private
 */
router.post(
  '/update/name',
  [
    auth,
    [
      check('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Name cannot be empty')
        .isLength({ min: 3 })
        .withMessage('Enter your full name')
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('Name has invalid characters')
        .custom(async (value, { req }) => {
          const user = await User.findById(req.user.id)
          if (user && user.name === value.trim())
            throw new Error('Old and new name cannot be same')
          return true
        })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({
        type: VALIDATION,
        errors: errors.array({ onlyFirstError: true })
      })

    try {
      const userID = req.user.id
      const { name } = req.body

      const user = await User.findById(userID)

      if (!user)
        return res.status(404).json({
          type: NOTFOUND,
          msg: "Account doesn't exist"
        })

      user.name = name
      await user.save()

      res.json({ name: user.name, msg: 'Name updated successfully!' })
    } catch (err) {
      res.status(500).send(SERVER)
      console.error(err.message)
    }
  }
)

/**
 * @route : POST api/user/update/email
 * @desc : Update User Email
 * @access : Private
 */
router.post(
  '/update/email',
  [
    auth,
    [
      check('email')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Enter a valid email')
        .custom(async (value, { req }) => {
          let user = await User.findOne({ email: value.trim() })
          if (user) {
            if (user._id == req.user.id)
              throw new Error('New and old email cannot be same')
            else throw new Error('Email already in use')
          }
          return true
        })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty())
      return res.status(400).json({
        type: VALIDATION,
        errors: errors.array({ onlyFirstError: true })
      })

    try {
      const userID = req.user.id
      const { email } = req.body

      const user = await User.findById(userID)

      if (!user)
        return res
          .status(404)
          .json({ type: NOTFOUND, msg: "Account doesn't exist" })

      user.email = email.trim()
      user.validated = false
      await user.save()

      const payload_EMAIL = {
        user: {
          email: user.email
        }
      }

      const mailOptions = await encryptMail(payload_EMAIL, user.email)

      sendMail(mailOptions).then(() => {
        console.log('Email sent successfully')
      })

      res.json({
        email: user.email,
        validated: user.validated,
        msg: `New verification mail sent to ${user.email}. It will expire in 1 day`
      })
    } catch (err) {
      res.status(500).send(SERVER)
      console.error(err.message)
    }
  }
)

/**
 * @route : POST api/user/update/password
 * @desc : Update User Password
 * @access : Private
 */
router.post(
  '/update/password',
  [
    auth,
    [
      check('oldPassword')
        .not()
        .isEmpty()
        .withMessage('Password cannot be empty')
        .custom(async (value, { req }) => {
          const user = await User.findById(req.user.id)
          if (user) {
            const isMatch = await bcrypt.compare(value, user.password)
            if (!isMatch) throw new Error('Password is incorrect')
          }
          return true
        }),

      check('newPassword')
        .not()
        .isEmpty()
        .withMessage('Password cannot be empty')
        .isLength({ min: 6 })
        .withMessage('Password cannot be less than 6 letters')
        .custom(async (value, { req }) => {
          const user = await User.findById(req.user.id)
          if (user) {
            const isMatch = await bcrypt.compare(value, user.password)
            if (isMatch)
              throw new Error('New password and old password cannot be same')
          }
          return true
        }),

      check('confirmNewPassword')
        .not()
        .isEmpty()
        .withMessage('Password cannot be empty')
        .custom((value, { req }) => {
          if (value !== req.body.newPassword)
            throw new Error("Passwords don't match")
          return true
        })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty())
      return res.status(400).json({
        type: VALIDATION,
        errors: errors.array({ onlyFirstError: true })
      })

    try {
      const userID = req.user.id
      const { newPassword } = req.body

      const user = await User.findById(userID)

      if (!user)
        return res.status(404).json({
          type: NOTFOUND,
          msg: "Account doesn't exist"
        })

      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(newPassword, salt)

      user.password = hash
      await user.save()

      res.json({ msg: 'Password has been updated' })
    } catch (err) {
      res.status(500).send(SERVER)
      console.error(err.message)
    }
  }
)

/**
 * @route : GET api/user/confirm/request_token
 * @desc : Request a validation token
 * @access : Private
 */
router.get('/confirm/request_token', auth, async (req, res) => {
  const userID = req.user.id

  try {
    const user = await User.findById(userID)

    if (!user)
      return res.status(404).json({
        type: NOTFOUND,
        msg: "Account doesn't exist"
      })

    if (user.validated)
      return res.status(400).json({
        msg: 'Email already verified'
      })

    const payload_EMAIL = {
      user: {
        email: user.email
      }
    }

    const mailOptions = await encryptMail(payload_EMAIL, user.email)

    sendMail(mailOptions).then(() => {
      res.json({
        email: user.email,
        msg: `New verification mail sent to ${user.email}. It will expire in 1 day`
      })
    })
  } catch (err) {
    res.status(500).send(SERVER)
    console.error(err.message)
  }
})

/**
 * @route : GET api/user/confirm/:email_token
 * @desc : Validate an User
 * @access : Public
 */
router.get('/confirm/:email_token', async (req, res) => {
  const token = req.params.email_token

  try {
    const decode = jwt.decode(token, process.env.EMAIL_SECRET)

    if (!decode)
      return res.status(400).send({
        msg: 'Token in invalid or expired. Please request a new token'
      })

    const email = decode.user.email

    if (!email)
      return res.status(400).send({
        msg: 'Token in invalid or expired. Please request a new token'
      })

    const user = await User.findOne({ email })

    if (!user)
      return res.status(400).send({
        msg: 'Token in invalid or expired. Please request a new token'
      })

    if (user.validated)
      return res.status(400).send({
        msg: 'Token in invalid or expired. Please request a new token'
      })

    user.validated = true
    await user.save()

    res.json({
      validated: user.validated,
      msg: `Your email ${email} has been validated succesfully! Thank you for using STORIES!`
    })
  } catch (err) {
    console.log(err)
    res.status(500).send(SERVER)
  }
})

/**
 * @route : DELETE api/user/
 * @desc : Delete an User
 * @access : Private
 */
router.delete(
  '/',
  [
    auth,
    [check('password').not().isEmpty().withMessage('Password cannot be empty')]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({
        type: VALIDATION,
        errors: errors.array({ onlyFirstError: true })
      })

    const userID = req.user.id
    const { password } = req.body
    try {
      const user = await User.findById(userID)

      if (!user)
        return res.status(404).json({
          type: NOTFOUND,
          msg: "Account doesn't exist"
        })

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch)
        return res.status(400).json({
          type: AUTHENTICATION,
          errors: [
            {
              param: 'password',
              msg: 'Password is incorrect'
            }
          ]
        })

      // Delete User Likes
      const likedPost = await Post.find({ 'likes.user': userID })

      if (likedPost.length > 0) {
        let arrLength = likedPost.length

        const DeleteAllLikesFromPosts = async () => {
          const post = likedPost.pop()

          console.log(
            `Deleting associated likes of user: ${userID} from post: ${post._id}`
          )

          post.likes = post.likes.filter((like) => like.user != userID)
          await post.save()
          if (--arrLength) DeleteAllLikesFromPosts()
        }
        DeleteAllLikesFromPosts()
      }

      // Delete User Comments
      const commentedPost = await Post.find({ 'comments.user': userID })

      if (commentedPost.length > 0) {
        let arrLength = commentedPost.length

        const DeleteAllCommentsFromPosts = async () => {
          const post = likedPost.pop()

          console.log(
            `Deleting associated comments of user: ${userID} from post: ${post._id}`
          )

          post.comments = post.comments.filter(
            (comment) => comment.user != userID
          )
          await post.save()
          if (--arrLength) DeleteAllCommentsFromPosts()
        }
        DeleteAllCommentsFromPosts()
      }

      // Delete User Following and Followers
      const followingProfile = await Profile.find({ 'following.user': userID })

      if (followingProfile.length > 0) {
        let arrLength = followingProfile.length

        const DeleteAllFollowing = async () => {
          const profile = followingProfile.pop()

          console.log(
            `Deleting associated following of user: ${userID} from post: ${post._id}`
          )

          profile.following = profile.following.filter(
            (follow) => follow.user != userID
          )
          await profile.save()
          if (--arrLength) DeleteAllFollowing()
        }
        DeleteAllFollowing()
      }

      const followerProfile = await Profile.find({ 'followers.user': userID })

      if (followerProfile.length > 0) {
        let arrLength = followerProfile.length

        const DeleteAllfollower = async () => {
          const profile = followerProfile.pop()

          console.log(
            `Deleting associated followers of user: ${userID} from post: ${post._id}`
          )

          profile.followers = profile.followers.filter(
            (follow) => follow.user != userID
          )
          await profile.save()
          if (--arrLength) DeleteAllfollower()
        }
        DeleteAllfollower()
      }

      await Profile.findOneAndRemove({ user: userID })
      console.log(`Deleted profile of user ${userID}`)

      await Post.deleteMany({ user: userID })
      console.log(`Deleted posts of user ${userID}`)

      await user.remove()
      console.log(`Completely deleted user: ${userID}`)

      res.json({ msg: 'Account deleted successfully' })
    } catch (err) {
      console.log(err.message)
      res.status(500).send(SERVER)
    }
  }
)

module.exports = router
