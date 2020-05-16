const Activity = require('../models/Activity')

const COMMENT = 'commented on your post'
const COMMENT_URL = '/home/post/view/'
const FOLLOW = 'started following you'
const FOLLOW_URL = '/home/profile/view/'

const ACTIVITY_FOLLOW = 'Follow'
const ACTIVITY_COMMENT = 'Comment'

const followActivity = async (profile, followProfile) => {
  try {
    const url = ''.concat(FOLLOW_URL, profile.user)
    const activity = {
      message: ''.concat('@', profile.username, ' ', FOLLOW),
      profile: profile._id,
      user: profile.user
    }

    let activityData = new Activity({
      user: followProfile.user,
      profile: followProfile._id,
      activity: activity,
      activity_type: ACTIVITY_FOLLOW,
      link: url
    })

    activityData = await activityData.save()
    return activityData
  } catch (err) {
    console.log(err.message)
    return null
  }
}

const commentActivity = async (post, profile) => {
  try {
    const url = ''.concat(COMMENT_URL, post._id)
    const activity = {
      message: ''.concat('@', profile.username, ' ', COMMENT),
      profile: profile._id
    }

    let activityData = new Activity({
      user: post.user,
      profile: post.profile,
      activity: activity,
      activity_type: ACTIVITY_COMMENT,
      link: url
    })

    activityData = await activityData.save()
    return activityData
  } catch (err) {
    console.log(err.message)
    return null
  }
}

module.exports = { followActivity, commentActivity }
