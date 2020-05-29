const express = require('express')
const auth = require('../../middleware/token-auth')
const ObjectID = require('mongoose').Types.ObjectId
const Activity = require('../../models/Activity')
const { SERVER, NOTFOUND } = require('../../config/errors')

const router = express.Router()

/**
 * @route : GET api/activity/
 * @desc : Get all activities
 * @access : Private
 */
router.get('/', auth, async (req, res) => {
  const userID = req.user.id

  try {
    const activities = await Activity.find({ user: userID }).populate(
      'activity.profile'
    )
    return res.json(activities)
  } catch (err) {
    console.log(err.message)
    res.status(500).send(SERVER)
  }
})

/**
 * @route : GET api/activity/:activityID
 * @desc : Mark activity as read
 * @access : Private
 */
router.get('/:activityID', auth, async (req, res) => {
  const activityID = req.params.activityID

  if (!ObjectID.isValid(activityID) || new ObjectID(activityID) != activityID)
    return res.status(404).json({ type: NOTFOUND, msg: 'Invalid activity' })

  try {
    const activity = await Activity.findById(activityID).populate(
      'activity.profile'
    )

    if (!activity)
      return res.status(404).json({ type: NOTFOUND, msg: 'Invalid activity' })

    activity.seen = true
    await activity.save()

    return res.json(activity)
  } catch (err) {
    console.log(err.message)
    res.status(500).send(SERVER)
  }
})

module.exports = router
