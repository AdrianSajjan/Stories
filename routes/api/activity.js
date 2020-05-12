const express = require('express')

const auth = require('../../middleware/token-auth')
const Activity = require('../../models/Activity')
const Profile = require('../../models/Profile')
const Post = require('../../models/Post')
const { SERVER } = require('../../config/errors')

const COMMENT = 'commented on your post'
const COMMENT_URL = '/home/post/'
const FOLLOW = 'started following you'
const FOLLOW_URL = '/home/profile/'

const router = express.Router()

router.get('/', auth, async (req, res) => {
  const userID = req.user.id

  try {
    const activities = await Activity.find({ user: userID })
    return res.json(activities)
  } catch (err) {
    console.log(err.message)
    res.status(500).send(SERVER)
  }
})

router.post('/:activityID', auth, async (req, res) => {
  const activityID = req.params.activityID

  try {
    const activity = await Activity.findById(activityID)
    activity.seen = true
    await activity.save()

    return res.json(activity)
  } catch (err) {
    console.log(err.message)
    res.status(500).send(SERVER)
  }
})

router.post('/follow', auth, async (req, res) => {
  try {
    const { profileID, followProfileID } = req.query

    const url = ''.concat(FOLLOW_URL, ':', profileID)

    const profile = await Profile.findById(profileID)
    const followProfile = await Profile.findById(followProfileID)

    if (!profile || !followProfile) return res.status(404).json({})

    const activity = ''.concat(profile.username, ' ', FOLLOW)

    let activityData = new Activity({
      user: followProfile.user,
      profile: followProfile._id,
      activity: activity,
      link: url
    })

    activityData = await activityData.save()
    return res.json(activityData)
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({})
  }
})

router.post('/comment', auth, async (req, res) => {
  try {
    const { postID, profileID } = req.query

    const url = ''.concat(COMMENT_URL, ':', postID)

    const profile = await Profile.findById(profileID)
    const post = await Post.findById(postID)

    if (!profile || !post) return res.status(404).json({})

    const activity = ''.concat(profile.username, ' ', COMMENT)

    let activityData = new Activity({
      user: post.user,
      profile: post.profile,
      activity: activity,
      link: url
    })

    activityData = await activityData.save()
    return res.json(activityData)
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({})
  }
})

module.exports = router
