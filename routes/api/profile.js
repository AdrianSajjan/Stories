const express = require('express')
const ObjectID = require('mongoose').Types.ObjectId
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const auth = require('../../middleware/token-auth')
const { check, validationResult } = require('express-validator')
const {
  VALIDATION,
  SERVER,
  NOTFOUND,
  AUTHENTICATION
} = require('../../config/errors')

const { followActivity } = require('../../utils/activity')

const router = express.Router()

/**
 * @route : GET /api/profile/me
 * @desc : Get current user profile
 * @access : Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    })
      .populate('user', ['name', 'email'])
      .populate('following.profile')
      .populate('followers.profile')

    if (!profile)
      return res.status(404).json({
        type: NOTFOUND,
        msg: "Profile doesn't exist"
      })

    res.json(profile)
  } catch (err) {
    console.log(err.message)
    res.status(500).send(SERVER)
  }
})

/**
 * @route : POST api/profile
 * @desc :  Add or Update user profile
 * @access : Private
 */
router.post(
  '/',
  [
    auth,
    [
      check('username')
        .not()
        .isEmpty()
        .withMessage('Username cannot be empty')
        .isLength({ min: 4 })
        .withMessage('Username should be more than 3 letters')
        .matches(/^[a-zA-Z0-9._]*$/)
        .withMessage(
          'Only letters, numbers, dot (.) and underscore (_) allowed'
        )
        .custom(async (value, { req }) => {
          const profile = await Profile.findOne({ username: value })
          if (profile && profile.user != req.user.id)
            throw new Error('Username is already taken')
          return true
        }),
      check('country')
        .not()
        .isEmpty()
        .withMessage('Please specify the country you reside presently'),
      check('dob')
        .not()
        .isEmpty()
        .withMessage('Date of Birth cannot be empty')
        .custom((value) => {
          const time = Date.parse(value) / 3.154e10
          const currentTime = Date.parse(new Date()) / 3.154e10
          if (!time || currentTime < time || Math.trunc(time) < -50)
            throw new Error('Provide a valid date of birth')
          return true
        })
    ]
  ],
  async (req, res) => {
    const userID = req.user.id

    try {
      let user = await User.findById(userID)

      if (!user)
        return res
          .status(404)
          .json({ type: NOTFOUND, msg: "User doesn't exist" })

      if (!user.validated)
        return res.status(401).json({
          type: AUTHENTICATION,
          errors: [{ msg: 'Please verify your email before creating profile.' }]
        })

      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res
          .status(400)
          .json({
            type: VALIDATION,
            errors: errors.array({ onlyFirstError: true })
          })

      const { username, dob, locality, state, country, bio } = req.body

      const profileData = {}
      profileData.username = username
      profileData.user = userID
      profileData.dob = dob
      profileData.country = country
      profileData.locality = locality ? locality : ''
      profileData.state = state ? state : ''
      profileData.bio = bio ? bio : ''

      let profile = await Profile.findOne({ user: userID })

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: userID },
          { $set: profileData },
          { new: true }
        )

        await profile
          .populate('user', ['name', 'email'])
          .populate('following.profile')
          .populate('followers.profile')
          .execPopulate()
        return res.send(profile)
      }

      profile = new Profile(profileData)

      await profile.save()
      await profile
        .populate('user', ['name', 'email'])
        .populate('following.profile')
        .populate('followers.profile')
        .execPopulate()

      res.json(profile)
    } catch (err) {
      console.log(err.message)
      return res.status(500).send(SERVER)
    }
  }
)

/**
 * @route : GET /api/profile/search
 * @desc : Search profile by username
 * @access : Private
 */
router.get('/search', auth, async (req, res) => {
  const userID = req.user.id
  const match = req.query.match
  const limit = 100

  if (!match || match.length < 3) return res.json([])

  try {
    const profile = await Profile.findOne({ user: userID })

    if (!profile)
      return res
        .status(404)
        .json({ type: NOTFOUND, msg: 'Please create your profile' })

    const profiles = await Profile.find({
      $and: [
        { username: { $regex: match, $options: 'i' } },
        { _id: { $ne: profile._id } }
      ]
    })
      .limit(limit)
      .populate('following.profile')
      .populate('followers.profile')

    res.json(profiles)
  } catch (err) {
    console.log(err.message)
    res.status(500).send(SERVER)
  }
})

/**
 * @route : GET /api/profile/discover
 * @desc : Get Profiles based on location
 * @access : Private
 */
router.get('/discover', auth, async (req, res) => {
  const userID = req.user.id
  const limit = 20
  const skip = (req.query.page || 0) * limit
  let otherProfiles = []

  try {
    const profile = await Profile.findOne({ user: userID })

    if (!profile)
      res
        .status(404)
        .json({ type: NOTFOUND, msg: 'Please create your profile' })

    const locality = profile.locality || ''
    const state = profile.state || ''
    const country = profile.country

    let profiles = await Profile.find({
      $and: [
        { _id: { $ne: profile.id } },
        { _id: { $nin: profile.following.map((user) => user.profile) } },
        { $or: [{ locality }, { state }, { country }] }
      ]
    })
      .skip(skip)
      .limit(limit)
      .populate('following.profile')
      .populate('followers.profile')
    otherProfiles = [...otherProfiles, ...profiles]

    const profilesDiff = limit - otherProfiles.length

    if (profilesDiff > 0) {
      profiles = await Profile.find({
        $and: [
          { _id: { $ne: profile.id } },
          { _id: { $nin: profile.following.map((user) => user.profile) } },
          { _id: { $nin: otherProfiles.map((profile) => profile._id) } }
        ]
      })
        .skip(skip)
        .limit(limit)
        .limit(profilesDiff)
        .populate('following.profile')
        .populate('followers.profile')
      otherProfiles = [...otherProfiles, ...profiles]
    }

    res.json(otherProfiles)
  } catch (err) {
    res.status(500).send(SERVER)
    console.log(err.message)
  }
})

/**
 * @route : GET api/profile/:userID
 * @desc :  View another profile by User ID
 * @access : Private
 */
router.get('/:userID', auth, async (req, res) => {
  const userID = req.params.userID

  if (!ObjectID.isValid(userID) || new ObjectID(userID) != userID)
    return res.status(400).json({ type: NOTFOUND, msg: 'Profile Not Found' })

  try {
    const profile = await Profile.findOne({ user: userID })
      .populate('following.profile')
      .populate('followers.profile')

    if (!profile)
      return res.status(400).json({ type: NOTFOUND, msg: 'Profile Not Found' })

    res.json(profile)
  } catch (err) {
    console.log(err.message)
    res.status(500).send(SERVER)
  }
})

/**
 * @route : PUT api/profile/follow/:id
 * @desc :  Update following and followers
 * @access : Private
 */
router.put('/follow/:id', auth, async (req, res) => {
  const id = req.user.id
  const otherUser = req.params.id

  if (otherUser === id)
    return res
      .status(400)
      .json({ type: VALIDATION, msg: 'You cannot follow yourself' })

  if (!ObjectID.isValid(otherUser) || new ObjectID(otherUser) != otherUser)
    return res.status(400).json({ type: NOTFOUND, msg: 'Profile not found!' })

  try {
    let otherProfile = await Profile.findOne({ user: otherUser })
    if (!otherProfile)
      return res.status(400).json({ type: NOTFOUND, msg: 'Profile not found' })

    let profile = await Profile.findOne({ user: id })
    if (!profile)
      return res
        .status(404)
        .json({
          type: NOTFOUND,
          msg: 'Create your profile before following other users'
        })

    if (profile.following.some((item) => item.user == otherUser)) {
      profile.following = profile.following.filter(
        (item) => item.user != otherUser
      )
      otherProfile.followers = otherProfile.followers.filter(
        (item) => item.user != id
      )

      await profile.save()
      await profile
        .populate('user', ['name', 'email'])
        .populate('following.profile')
        .populate('followers.profile')
        .execPopulate()

      await otherProfile.save()

      return res.json({ profile })
    }

    let body = {
      user: otherUser,
      profile: otherProfile.id,
      date: new Date()
    }
    profile.following.push(body)
    await profile.save()

    body = {
      user: id,
      profile: profile.id,
      date: new Date()
    }
    otherProfile.followers.push(body)
    await otherProfile.save()

    const activity = await followActivity(profile, otherProfile)
    await profile
      .populate('user', ['name', 'email'])
      .populate('following.profile')
      .populate('followers.profile')
      .execPopulate()

    return res.json({ profile, activity })
  } catch (err) {
    console.log(err.message)
    res.status(500).send(SERVER)
  }
})

module.exports = router
