const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ActivitySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'profile'
  },
  activity: {
    message: {
      type: String,
      required: true
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'profile'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    post: {
      type: Schema.Types.ObjectID,
      ref: 'post'
    }
  },
  activity_type: {
    type: 'String',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  seen: {
    type: Boolean,
    default: false
  },
  link: {
    type: String
  }
})

module.exports = Activity = mongoose.model('activity', ActivitySchema, 'Activity')
